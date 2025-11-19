import { ContractAPI, ContractProviders, PrivateStateId } from "sdk";
import { buildWalletFromSeed, createWalletAndMidnightProvider, INDEXER, INDEXER_WS, logger, mnmemonicsToHexSeed, PRIVATE_STATE_STORE_NAME, PROOF_SERVER, SEED, ZK_CONFIG_PATH } from "./utils";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";

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
  zkConfigProvider: new NodeZkConfigProvider<"submitProof" | "mint" | "transfer">(
    ZK_CONFIG_PATH
  ),
  proofProvider: httpClientProofProvider(PROOF_SERVER),
  walletProvider: walletAndMidnightProvider,
  midnightProvider: walletAndMidnightProvider,
};

// Example: Deploy with tDUST as payment currency (native token), 100 units per token
// Contract now hardcodes tDUST as the payment type
const pricePerToken = 100n;

console.log("Deploying contract with:");
console.log("  Token Name: USD-ZK");
console.log("  Price per Token:", pricePerToken.toString(), "units");
console.log("  Payment Type: tDUST (native token, hardcoded in contract)");

const api = await ContractAPI.deploy(providers, "USD-ZK", pricePerToken, logger);

console.log("Deployed contract address: ", api.deployedContractAddress);


