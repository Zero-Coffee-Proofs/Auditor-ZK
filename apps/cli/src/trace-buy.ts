import * as Rx from 'rxjs';
import { ContractAPI, ContractProviders } from "sdk";
import { PrivateStateId } from "@midnight-ntwrk/midnight-js-types";
import { encodeTokenType, QualifiedCoinInfo } from "@midnight-ntwrk/compact-runtime";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { waitForTxInHistory } from "@midnight-ntwrk/midnight-js-testing";

import { buildWalletFromSeed, createWalletAndMidnightProvider, INDEXER, INDEXER_WS, logger, mnmemonicsToHexSeed, PRIVATE_STATE_STORE_NAME, PROOF_SERVER, SEED, ZK_CONFIG_PATH } from "./utils";
import { Wallet } from '@midnight-ntwrk/wallet-api';
import { nativeToken } from '@midnight-ntwrk/ledger';
// ===========================
// TRACE: Token Buy Flow
// ===========================
// This file demonstrates buying tokens from the issuer:
// 1. Connect to deployed contract
// 2. Check current state (tokens must be minted)
// 3. Buyer purchases tokens with payment
// Each step includes state verification with warnings

// ===========================
// HELPER: State Polling with Transaction Wait
// ===========================
/**
 * Waits for a transaction to be confirmed and then polls state until condition is met.
 * @param api - Contract API instance
 * @param txHash - Transaction hash to wait for (optional)
 * @param wallet - Wallet instance for transaction waiting
 * @param checkFn - Function that returns true when desired state is reached
 * @param description - Description of what we're waiting for (for logging)
 * @param timeoutMs - Maximum time to wait in milliseconds (default: 60 seconds)
 * @param pollIntervalMs - How often to check state in milliseconds (default: 1000ms)
 * @returns The updated state when condition is met
 */
async function waitForStateUpdate<T>(
  api: ContractAPI,
  txHash: string | null,
  wallet: Wallet,
  checkFn: (state: any) => T | null,
  description: string,
  timeoutMs: number = 60000,
  pollIntervalMs: number = 1000
): Promise<T> {
  const startTime = Date.now();

  // First, wait for transaction to be in history if hash provided
  if (txHash) {
    console.log(`  Waiting for transaction ${txHash.substring(0, 16)}... to be confirmed`);
    try {
      await waitForTxInHistory(txHash, wallet, timeoutMs);
      console.log(`  ✓ Transaction confirmed in blockchain`);
    } catch (error) {
      console.warn(`  ⚠️  Transaction wait timeout, continuing to poll state anyway...`);
    }
  }

  // Then poll the state until condition is met
  let attempts = 0;
  while (Date.now() - startTime < timeoutMs) {
    attempts++;
    const state = await Rx.firstValueFrom(api.state$);
    const result = checkFn(state);

    if (result !== null) {
      console.log(`✓ State updated after ${attempts} poll(s) (${Date.now() - startTime}ms total)`);
      return result;
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(`Timeout waiting for ${description} after ${timeoutMs}ms`);
}

console.log("=".repeat(80));
console.log("AUDITOR-ZK TOKEN BUY FLOW TRACE");
console.log("=".repeat(80));
console.log();

// ===========================
// STEP 0: Setup Test Data
// ===========================
console.log("--- STEP 0: Preparing Test Data ---");

// Amount to buy: 100 tokens
const AMOUNT_TO_BUY = 1n;

console.log("Test Data:");
console.log("  Amount to Buy:", AMOUNT_TO_BUY.toString(), "tokens");
console.log();

// ===========================
// STEP 1: Initialize Providers
// ===========================
console.log("--- STEP 1: Initializing Midnight Providers ---");
// const seed = "control arch flavor forget craft cushion time page grief faint aspect dove diet same afraid shrimp laptop era virus roof rare arena age cigar"
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
  zkConfigProvider: new NodeZkConfigProvider<"submitProof" | "mint" | "transfer" | "buy" | "owner">(
    ZK_CONFIG_PATH
  ),
  proofProvider: httpClientProofProvider(PROOF_SERVER),
  walletProvider: walletAndMidnightProvider,
  midnightProvider: walletAndMidnightProvider,
};

console.log("✓ Providers initialized");
console.log();

// ===========================
// STEP 2: Connect to Contract
// ===========================
console.log("--- STEP 2: Connecting to Deployed Contract ---");

// Same contract address as trace.ts
const contractAddress = "0200dfbba52a54506889ee7bbce38e0af85d13b4e7be67cb823612e501e7b971e242";
console.log("Contract Address:", contractAddress);

const api = await ContractAPI.join(providers, contractAddress, logger);
console.log("✓ Connected to contract");
console.log();

// ===========================
// STEP 3: Initial State Check
// ===========================
console.log("--- STEP 3: Initial Contract State ---");

let state = await Rx.firstValueFrom(api.state$);
console.log("Token Info:");
console.log("  Name:", new TextDecoder().decode(state.tokenInfo.name));
console.log("  Total Supply:", state.tokenInfo.totalSupply.toString());
console.log("  Minted:", state.minted.toString());
console.log();

console.log("Payment Config:");
console.log("  Price per Token:", state.pricePerToken.toString());
console.log();

console.log("Issuer:");
console.log("  Nullifier:", Buffer.from(state.issuerNullifier).toString('hex'));
console.log();

// Check issuer's current token balance
let issuerBalance = 0n;
const issuerNullifierHex = Buffer.from(state.issuerNullifier).toString('hex');
for (const [nullifier, balance] of state.balances.entries()) {
  const nullifierHex = Buffer.from(nullifier, 'hex').toString('hex');
  if (nullifierHex === issuerNullifierHex) {
    issuerBalance = balance;
    break;
  }
}

console.log("Issuer Token Balance:", issuerBalance.toString());
console.log();

console.log("Balances:", state.balances.size === 0 ? "None" : Array.from(state.balances.entries()).length);
if (state.balances.size > 0) {
  console.log("Current Token Balances (Nullifier -> Amount):");
  for (const [nullifier, balance] of state.balances.entries()) {
    const isIssuer = nullifier === issuerNullifierHex;
    console.log("  ", nullifier.substring(0, 16) + "...", "->", balance.toString(), isIssuer ? "(ISSUER)" : "");
  }
}
console.log();

// Warnings for initial state
if (state.minted !== 1n) {
  console.warn("⚠️  WARNING: Tokens not yet minted (minted =", state.minted.toString() + ")");
  console.warn("   Buy operation will fail - must mint tokens first");
  console.log();
}

if (issuerBalance === 0n) {
  console.warn("⚠️  WARNING: Issuer has no tokens to sell");
  console.warn("   Buy operation will fail");
  console.log();
}

if (issuerBalance < AMOUNT_TO_BUY) {
  console.warn("⚠️  WARNING: Issuer has insufficient tokens");
  console.warn("   Has:", issuerBalance.toString(), "Need:", AMOUNT_TO_BUY.toString());
  console.warn("   Buy operation may fail");
  console.log();
}

// ===========================
// STEP 4: Buy Tokens
// ===========================
console.log("--- STEP 4: Buying Tokens from Issuer ---");
console.log("This step demonstrates a buyer purchasing tokens with payment");
console.log();

try {
  console.log("Calling buy()...");
  console.log("  Amount to Buy:", AMOUNT_TO_BUY.toString(), "tokens");

  // Calculate required payment
  const totalPrice = AMOUNT_TO_BUY * state.pricePerToken;
  console.log("  Total Price:", totalPrice.toString(), "units");
  console.log("  Price per Token:", state.pricePerToken.toString(), "units");
  console.log();

  // Get available coins from wallet
  console.log("Fetching available coins from wallet...");
  const walletState = await Rx.firstValueFrom(wallet.state());
  console.log("Available coins:", walletState.availableCoins.length);
  console.log();

  if (walletState.availableCoins.length === 0) {
    console.warn("⚠️  WARNING: No coins available in wallet");
    console.warn("   Buy operation cannot proceed");
    throw new Error("No coins available");
  }

  // Display available coins
  console.log("Wallet Coins:");
  for (let i = 0; i < walletState.availableCoins.length; i++) {
    const coin = walletState.availableCoins[i];
    console.log(`  [${i}] Type:`, Buffer.from(coin.type).toString('hex').substring(0, 16) + "...");
    console.log(`      Value:`, coin.value.toString());
    console.log(`      Nonce:`, coin.nonce.toString());
  }
  console.log();


  const selectedCoin: QualifiedCoinInfo = walletState.availableCoins[0];

  console.log("Selected coin for payment:");
  console.log("  Type:", Buffer.from(selectedCoin.type).toString('hex').substring(0, 16) + "...");
  console.log("  Value:", selectedCoin.value.toString());
  console.log("  Nonce:", Buffer.from(selectedCoin.nonce).toString('hex').substring(0, 16) + "...");
  console.log();

  console.log("Transaction will:");
  console.log("  1. Verify payment matches price (", totalPrice.toString(), "units)");
  console.log("  2. Verify payment coin type matches expectedCoinType");
  console.log("  3. Deduct", AMOUNT_TO_BUY.toString(), "tokens from issuer's balance");
  console.log("  4. Add", AMOUNT_TO_BUY.toString(), "tokens to buyer's nullifier");
  console.log("  5. Store payment in contract for issuer to claim");
  console.log();

  // Generate random nonce for the payment
  function randomBytes(length: number): Uint8Array {
    const bytes = new Uint8Array(length);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(bytes);
    } else {
      // Fallback for Node.js
      const nodeCrypto = require('crypto');
      const randomBuffer = nodeCrypto.randomBytes(length);
      bytes.set(randomBuffer);
    }
    return bytes;
  }

  const buyTx = await api.buy(
    AMOUNT_TO_BUY,
    {
      color: encodeTokenType(nativeToken()),
      nonce: randomBytes(32),
      value: 200n
    }
  );

  console.log("✓ Tokens purchased successfully");
  console.log();

  // Wait for state update
  console.log("Waiting for state update...");
  try {
    state = await waitForStateUpdate(
      api,
      null,
      wallet,
      (s: any) => {
        // Check if issuer's balance decreased
        let currentIssuerBalance = 0n;
        const issuerNullHex = Buffer.from(s.issuerNullifier).toString('hex');
        for (const [nullifier, balance] of s.balances.entries()) {
          const nullifierHex = Buffer.from(nullifier, 'hex').toString('hex');
          if (nullifierHex === issuerNullHex) {
            currentIssuerBalance = balance;
            break;
          }
        }

        // If issuer balance decreased, buy completed
        if (currentIssuerBalance < issuerBalance) {
          return s;
        }
        return null;
      },
      "buy completion",
      60000,
      1000
    );

    console.log();
    console.log("Post-Buy State:");
    console.log("  Total Supply:", state.tokenInfo.totalSupply.toString());

    // Show updated issuer balance
    let newIssuerBalance = 0n;
    for (const [nullifier, balance] of state.balances.entries()) {
      const nullifierHex = Buffer.from(nullifier, 'hex').toString('hex');
      if (nullifierHex === issuerNullifierHex) {
        newIssuerBalance = balance;
        break;
      }
    }

    console.log("  Issuer Balance (after sale):", newIssuerBalance.toString());
    console.log("  Tokens Sold:", (issuerBalance - newIssuerBalance).toString());
    console.log();

    // Show all balances
    if (state.balances.size > 0) {
      console.log("Updated Token Balances (Nullifier -> Amount):");
      for (const [nullifier, balance] of state.balances.entries()) {
        const isIssuer = nullifier === issuerNullifierHex;
        console.log("  ", nullifier.substring(0, 16) + "...", "->", balance.toString(), isIssuer ? "(ISSUER)" : "");
      }
      console.log();
    }

    // Verify buy results
    if (newIssuerBalance !== issuerBalance - AMOUNT_TO_BUY) {
      console.warn("⚠️  WARNING: Issuer balance mismatch!");
      console.warn("   Expected:", (issuerBalance - AMOUNT_TO_BUY).toString());
      console.warn("   Actual:", newIssuerBalance.toString());
      console.log();
    } else {
      console.log("✓ Issuer balance verified");
      console.log();
    }

  } catch (timeoutError) {
    console.warn("⚠️  WARNING: State update timeout");
    console.warn("   ", timeoutError instanceof Error ? timeoutError.message : String(timeoutError));
    console.warn("   State may not have updated yet. Continuing anyway...");
    console.log();
  }

} catch (error) {
  console.error("✗ buy() failed:");
  console.error("  Error:", error instanceof Error ? error.message : String(error));
  console.error();
  console.error("  This may be because:");
  console.error("  - Tokens not yet minted (minted != 1)");
  console.error("  - Issuer has insufficient tokens");
  console.error("  - Payment coin type doesn't match expectedCoinType");
  console.error("  - Payment amount doesn't match price");
  console.error("  - Transaction failed to confirm");
  console.error();
}

// ===========================
// STEP 5: Final State Summary
// ===========================
console.log("=".repeat(80));
console.log("FINAL CONTRACT STATE");
console.log("=".repeat(80));

state = await Rx.firstValueFrom(api.state$);

console.log();
console.log("Token Info:");
console.log("  Name:", new TextDecoder().decode(state.tokenInfo.name));
console.log("  Total Supply:", state.tokenInfo.totalSupply.toString());
console.log("  Minted:", state.minted === 1n ? "Yes" : "No");
console.log();

console.log("Issuer:");
console.log("  Nullifier:", Buffer.from(state.issuerNullifier).toString('hex'));
console.log();

console.log("Token Balances:");
if (state.balances.size === 0) {
  console.log("  No balances (tokens not yet minted)");
} else {
  for (const [nullifier, balance] of state.balances.entries()) {
    const isIssuer = nullifier === Buffer.from(state.issuerNullifier).toString('hex');
    console.log("  ", nullifier.substring(0, 16) + "...", "->", balance.toString(), isIssuer ? "(ISSUER)" : "");
  }
}
console.log();

console.log("Payment Config:");
console.log("  Price per Token:", state.pricePerToken.toString(), "units");
console.log();

console.log("=".repeat(80));
console.log("TRACE COMPLETE");
console.log("=".repeat(80));

process.exit(0);
