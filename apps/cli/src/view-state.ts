import * as Rx from 'rxjs';
import { ContractAPI, ContractProviders } from "sdk";
import { PrivateStateId } from "@midnight-ntwrk/midnight-js-types";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";

import { buildWalletFromSeed, createWalletAndMidnightProvider, INDEXER, INDEXER_WS, logger, mnmemonicsToHexSeed, PRIVATE_STATE_STORE_NAME, PROOF_SERVER, SEED, ZK_CONFIG_PATH } from "./utils";
import { pureCircuits } from 'contracts';

console.log("=".repeat(80));
console.log("CONTRACT STATE VIEWER");
console.log("=".repeat(80));
console.log();

// Get contract address from command line or use default
const contractAddress = process.argv[2] || "0200e35d3c779c4000efd223981eb807e865652592111fb99eaf77b7a654185e386b";

console.log("Contract Address:", contractAddress);
console.log();

// Initialize providers
const wallet = await buildWalletFromSeed(mnmemonicsToHexSeed(SEED));
const walletAndMidnightProvider = await createWalletAndMidnightProvider(wallet);

const providers: ContractProviders = {
  privateStateProvider: levelPrivateStateProvider<PrivateStateId>({
    privateStateStoreName: PRIVATE_STATE_STORE_NAME,
  }),
  publicDataProvider: indexerPublicDataProvider(
    INDEXER,
    INDEXER_WS
  ),
  zkConfigProvider: new NodeZkConfigProvider<"submitProof" | "mint" | "transfer">(
    ZK_CONFIG_PATH
  ),
  proofProvider: httpClientProofProvider(PROOF_SERVER),
  walletProvider: walletAndMidnightProvider,
  midnightProvider: walletAndMidnightProvider,
};

console.log("Connecting to contract...");
const api = await ContractAPI.join(providers, contractAddress, logger);
console.log("✓ Connected");
console.log();

// Fetch current state
const state = await Rx.firstValueFrom(api.state$);

console.log("=".repeat(80));
console.log("TOKEN INFORMATION");
console.log("=".repeat(80));
console.log();

const tokenName = new TextDecoder().decode(state.tokenInfo.name).replace(/\0/g, '');
console.log("Token Name:        ", tokenName);
console.log("Total Supply:      ", state.tokenInfo.totalSupply.toString());
console.log("Minted:            ", state.minted === 1n ? "✓ Yes (locked)" : "✗ No");
console.log();

console.log("=".repeat(80));
console.log("PROOF OF RESERVES");
console.log("=".repeat(80));
console.log();

const commitment = Buffer.from(state.proofOfReserves.commitment).toString('hex');
const isEmptyCommitment = commitment === "0".repeat(64);

if (isEmptyCommitment) {
  console.log("Status:            ✗ No proof submitted");
  console.log();
} else {
  console.log("Status:            ✓ Proof submitted");
  console.log("Commitment:        ", commitment);
  console.log("Timestamp:         ", state.proofOfReserves.timestamp.toString());
  const date = new Date(Number(state.proofOfReserves.timestamp) * 1000);
  console.log("Date:              ", date.toISOString());
  console.log("Threshold:         ", state.proofOfReserves.threshold.toString(), "cents");
  console.log("Threshold ($):     $" + (Number(state.proofOfReserves.threshold) / 100).toFixed(2));
  console.log();
}

console.log("=".repeat(80));
console.log("ISSUER INFORMATION");
console.log("=".repeat(80));
console.log();

const issuerNullifier = Buffer.from(state.issuerNullifier).toString('hex');
const isEmptyIssuer = issuerNullifier === "0".repeat(64);

if (isEmptyIssuer) {
  console.log("Status:            ✗ No issuer set (not minted yet)");
  console.log();
} else {
  console.log("Status:            ✓ Issuer set");
  console.log("Nullifier:         ", issuerNullifier);

  // Find issuer's balance
  let issuerBalance = 0n;
  for (const [nullifier, balance] of state.balances.entries()) {
    if (nullifier === issuerNullifier) {
      issuerBalance = balance;
      break;
    }
  }

  console.log("Token Balance:     ", issuerBalance.toString());
  console.log();
}

console.log("=".repeat(80));
console.log("TOKEN BALANCES");
console.log("=".repeat(80));
console.log();

if (state.balances.size === 0) {
  console.log("No token holders yet");
  console.log();
} else {
  console.log("Total Holders:     ", state.balances.size);
  console.log();

  let totalDistributed = 0n;
  const balanceList: Array<{ nullifier: string; balance: bigint; isIssuer: boolean }> = [];

  for (const [nullifier, balance] of state.balances.entries()) {
    totalDistributed += balance;
    balanceList.push({
      nullifier,
      balance,
      isIssuer: nullifier === issuerNullifier
    });
  }

  // Sort by balance descending
  balanceList.sort((a, b) => {
    if (a.balance > b.balance) return -1;
    if (a.balance < b.balance) return 1;
    return 0;
  });

  console.log("Holder Details:");
  console.log();

  balanceList.forEach((holder, index) => {
    const shortNullifier = holder.nullifier.substring(0, 12) + "..." + holder.nullifier.substring(holder.nullifier.length - 12);
    const role = holder.isIssuer ? " (ISSUER)" : "";
    const percentage = state.tokenInfo.totalSupply > 0n
      ? ((Number(holder.balance) / Number(state.tokenInfo.totalSupply)) * 100).toFixed(2)
      : "0.00";

    console.log(`  ${(index + 1).toString().padStart(2)}. ${shortNullifier}${role}`);
    console.log(`      Balance: ${holder.balance.toString().padStart(15)} (${percentage}%)`);
    console.log();
  });

  console.log("Total Distributed: ", totalDistributed.toString());

  if (totalDistributed !== state.tokenInfo.totalSupply) {
    console.warn("⚠️  WARNING: Distributed balance doesn't match total supply!");
    console.warn("   Total Supply:", state.tokenInfo.totalSupply.toString());
    console.warn("   Distributed: ", totalDistributed.toString());
  }
  console.log();
}

console.log("=".repeat(80));
console.log("PAYMENT CONFIGURATION");
console.log("=".repeat(80));
console.log();

console.log("Price per Token:   ", state.pricePerToken.toString(), "units");

if (state.pricePerToken > 0n) {
  const totalValue = state.tokenInfo.totalSupply * state.pricePerToken;
  console.log("Total Value:       ", totalValue.toString(), "units");
}
console.log();

// console.log("=".repeat(80));
// console.log("OWNER");
// console.log("=".repeat(80));
// console.log();

// try {
//   const owner = await api.getOwner();

//   if (owner.is_left) {
//     console.log("Type:              Wallet (ZswapCoinPublicKey)");
//     console.log("Key:               ", Buffer.from(owner.left.bytes).toString('hex'));
//   } else {
//     console.log("Type:              Contract");
//     console.log("Address:           ", Buffer.from(owner.right.bytes).toString('hex'));
//   }
//   console.log();
// } catch (error) {
//   console.log("Owner:             Unable to query");
//   console.log("Error:             ", error instanceof Error ? error.message : String(error));
//   console.log();
// }

console.log("=".repeat(80));

process.exit(0);
