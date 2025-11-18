import * as Rx from 'rxjs';
import { ContractAPI, ContractProviders } from "sdk";
import { PrivateStateId } from "@midnight-ntwrk/midnight-js-types";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";

import { buildWalletFromSeed, createWalletAndMidnightProvider, INDEXER, INDEXER_WS, logger, mnmemonicsToHexSeed, PRIVATE_STATE_STORE_NAME, PROOF_SERVER, SEED, ZK_CONFIG_PATH } from "./utils";

const wallet = await buildWalletFromSeed(mnmemonicsToHexSeed(SEED));
const walletAndMidnightProvider =
  await createWalletAndMidnightProvider(wallet);

const providers: ContractProviders = {
  privateStateProvider: levelPrivateStateProvider<PrivateStateId>({
    privateStateStoreName: PRIVATE_STATE_STORE_NAME,
  }),
  publicDataProvider: indexerPublicDataProvider(
    INDEXER,
    INDEXER_WS
  ),
  zkConfigProvider: new NodeZkConfigProvider<"submitProof" | "mint" | "transfer" | "buy" | "owner">(
    ZK_CONFIG_PATH
  ),
  proofProvider: httpClientProofProvider(PROOF_SERVER),
  walletProvider: walletAndMidnightProvider,
  midnightProvider: walletAndMidnightProvider,
};

// Replace with your deployed contract address
const contractAddress = "0200f2e857cbb73aa7627dba0adc9c363b913f9a7b2a4fe335d521e49e04b429a7ee";

const api = await ContractAPI.join(providers, contractAddress, logger);

// Log the contract state
const state = await Rx.firstValueFrom(api.state$);
console.log("Contract State:", {
  owner: state.owner,
  tokenName: new TextDecoder().decode(state.tokenInfo.name),
  totalSupply: state.tokenInfo.totalSupply,
  minted: state.minted,
  pricePerToken: state.pricePerToken,
  expectedCoinType: state.expectedCoinType,
  issuerNullifier: state.issuerNullifier,
  proofOfReserves: {
    commitment: state.proofOfReserves.commitment,
    timestamp: state.proofOfReserves.timestamp,
    threshold: state.proofOfReserves.threshold,
  },
  balances: Array.from(state.balances.entries()),
});

process.exit(0)




