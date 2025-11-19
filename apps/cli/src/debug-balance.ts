import * as Rx from 'rxjs';
import { ContractAPI, ContractProviders } from "sdk";
import { PrivateStateId } from "@midnight-ntwrk/midnight-js-types";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";

import { buildWalletFromSeed, createWalletAndMidnightProvider, INDEXER, INDEXER_WS, logger, mnmemonicsToHexSeed, PRIVATE_STATE_STORE_NAME, PROOF_SERVER, SEED, ZK_CONFIG_PATH } from "./utils";

console.log("=".repeat(80));
console.log("DEBUG: Balance Bytes Conversion");
console.log("=".repeat(80));
console.log();

// Test balance: $20,912.75 = 2,091,275 cents
const TEST_BALANCE_CENTS = 2091275n;

console.log("Testing balance:", TEST_BALANCE_CENTS.toString(), "cents = $" + (Number(TEST_BALANCE_CENTS) / 100).toFixed(2));
console.log();

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
  zkConfigProvider: new NodeZkConfigProvider<"submitProof" | "mint" | "transfer" | "buy" | "owner" | "debugBalanceBytes">(
    ZK_CONFIG_PATH
  ),
  proofProvider: httpClientProofProvider(PROOF_SERVER),
  walletProvider: walletAndMidnightProvider,
  midnightProvider: walletAndMidnightProvider,
};

// Replace with your deployed contract address
const contractAddress = "0200f2e857cbb73aa7627dba0adc9c363b913f9a7b2a4fe335d521e49e04b429a7ee";

const api = await ContractAPI.join(providers, contractAddress, logger);

console.log("Calling debugBalanceBytes()...");
console.log();

try {
  const balanceBytes = await api.debugBalanceBytes(TEST_BALANCE_CENTS);

  console.log("✓ Balance bytes returned from contract:");
  console.log("  Hex:", Buffer.from(balanceBytes).toString('hex'));
  console.log("  Length:", balanceBytes.length, "bytes");
  console.log();

  // Show byte-by-byte breakdown
  console.log("Byte breakdown:");
  const buf = Buffer.from(balanceBytes);
  for (let i = 0; i < buf.length; i += 8) {
    const chunk = buf.slice(i, Math.min(i + 8, buf.length));
    console.log(`  Bytes ${i.toString().padStart(2)}-${Math.min(i + 7, buf.length - 1).toString().padStart(2)}:`, chunk.toString('hex'));
  }
  console.log();

  console.log("This is how Compact converts: (balance as Field) as Bytes<32>");
  console.log("Use this exact byte representation when computing the commitment hash!");

} catch (error) {
  console.error("✗ debugBalanceBytes() failed:");
  console.error("  Error:", error instanceof Error ? error.message : String(error));
  console.error();
  console.error("  Make sure:");
  console.error("  - Contract has been rebuilt with the debugBalanceBytes circuit");
  console.error("  - SDK has been regenerated from the updated contract");
  console.error("  - ZK config includes 'debugBalanceBytes' circuit");
}

process.exit(0);
