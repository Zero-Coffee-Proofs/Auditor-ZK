import pino from "pino";
import path from 'path'
import { Resource, WalletBuilder } from "@midnight-ntwrk/wallet";
import { Wallet } from "@midnight-ntwrk/wallet-api";
import { getLedgerNetworkId, getZswapNetworkId, NetworkId, setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import { nativeToken, } from "@midnight-ntwrk/ledger";
import * as Rx from 'rxjs';
import { Transaction as ZswapTransaction } from "@midnight-ntwrk/zswap";
import bip39 from 'bip39';
import { HDWallet, Roles } from "@midnight-ntwrk/wallet-sdk-hd";
import assert from "assert";
import { MidnightProvider, WalletProvider, UnbalancedTransaction, BalancedTransaction, createBalancedTx } from "@midnight-ntwrk/midnight-js-types";
import {
  type CoinInfo,
  Transaction,
  type TransactionId,
} from "@midnight-ntwrk/ledger";

setNetworkId(NetworkId.TestNet);
export const logger = pino();

export const SEED = "wire ramp index pledge page output happy bird night engine skate opera first option initial demise prosper bamboo monster omit unfold wine release balance";

export const INDEXER = 'https://indexer.testnet-02.midnight.network/api/v1/graphql';
export const INDEXER_WS = 'wss://indexer.testnet-02.midnight.network/api/v1/graphql/ws';
export const NODE = 'https://rpc.testnet-02.midnight.network';
export const PROOF_SERVER = 'http://localhost:6300';
export const currentDir = path.resolve(new URL(import.meta.url).pathname, '..', '..');
export const ZK_CONFIG_PATH = path.resolve(currentDir, '..', '..', 'packages', 'contract', 'src', 'generated');
export const PRIVATE_STATE_STORE_NAME = 'kyc-private-state';



export async function waitForFunds(wallet: Wallet) {
  return Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.throttleTime(10_000),
      Rx.tap((state) => {
        const scanned = state.syncProgress?.synced ?? 0n;
        const behind =
          state.syncProgress?.lag.applyGap.toString() ?? "unknown number";
        logger.info(`Wallet processed ${scanned} indices, remaining ${behind}`);
      }),
      Rx.filter((state) => {
        // Let's allow progress only if wallet is close enough
        const synced =
          typeof state.syncProgress?.synced === "bigint"
            ? state.syncProgress.synced
            : 0n;
        const total =
          typeof state.syncProgress?.lag?.applyGap === "bigint"
            ? state.syncProgress.lag.applyGap
            : 1_000n;
        return total - synced < 100n;
      }),
      Rx.map((s) => s.balances[nativeToken()] ?? 0n),
      Rx.filter((balance) => balance > 0n)
    )
  );
}

export function mnmemonicsToHexSeed(mnemonic: string) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const generatedWallet = HDWallet.fromSeed(seed);

  // from README at: https://www.npmjs.com/package/@midnight-ntwrk/wallet-sdk-hd
  assert(generatedWallet.type == 'seedOk', "Error generating HDWallet")
  const zswapKey = generatedWallet.hdWallet.selectAccount(0).selectRole(Roles.Zswap).deriveKeyAt(0);
  assert(zswapKey.type === 'keyDerived', "Error deriving key from seed");
  return Buffer.from(zswapKey.key).toString('hex');
}

export async function createWalletAndMidnightProvider(
  wallet: Wallet
): Promise<WalletProvider & MidnightProvider> {
  const state = await Rx.firstValueFrom(wallet.state());
  return {
    coinPublicKey: state.coinPublicKey,
    encryptionPublicKey: state.encryptionPublicKey,
    balanceTx(
      tx: UnbalancedTransaction,
      newCoins: CoinInfo[]
    ): Promise<BalancedTransaction> {
      return wallet
        .balanceTransaction(
          ZswapTransaction.deserialize(
            tx.serialize(getLedgerNetworkId()),
            getZswapNetworkId()
          ),
          newCoins
        )
        .then((tx) => wallet.proveTransaction(tx))
        .then((zswapTx) =>
          Transaction.deserialize(
            zswapTx.serialize(getZswapNetworkId()),
            getLedgerNetworkId()
          )
        )
        .then(createBalancedTx);
    },
    submitTx(tx: BalancedTransaction): Promise<TransactionId> {
      return wallet.submitTransaction(tx);
    },
  };
};


export async function buildWalletFromSeed(
  seed: string
): Promise<Wallet & Resource> {
  console.log("Building wallet...")
  //const entropy = mnemonicToEntropy(seedArg, wordlist);
  //const seed = Buffer.from(entropy).toString('hex');

  const wallet = await WalletBuilder.build(
    INDEXER,
    INDEXER_WS,
    PROOF_SERVER,
    NODE,
    seed,
    getZswapNetworkId(),
    "debug"
  );
  console.log("wallet built")
  wallet.start();
  const state = await Rx.firstValueFrom(wallet.state());
  logger.info(`Your wallet seed is: ${seed}`);
  logger.info(`Your wallet address is: ${state.address}`);
  let balance = state.balances[nativeToken()];
  if (balance === undefined || balance === 0n) {
    logger.info(`Your wallet balance is: 0`);
    logger.info(`Waiting to receive tokens...`);
    balance = await waitForFunds(wallet);
  }
  logger.info(`Your wallet balance is: ${balance}`);
  return wallet;
}
