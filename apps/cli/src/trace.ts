import * as Rx from 'rxjs';
import { ContractAPI, ContractProviders, uint8arraytostring } from "sdk";
import { PrivateStateId } from "@midnight-ntwrk/midnight-js-types";
import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { NodeZkConfigProvider } from "@midnight-ntwrk/midnight-js-node-zk-config-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import { convertFieldToBytes } from "@midnight-ntwrk/compact-runtime";
import {waitForTxInHistory} from  "@midnight-ntwrk/midnight-js-testing"
import { createHash } from 'crypto';

import { buildWalletFromSeed, createWalletAndMidnightProvider, INDEXER, INDEXER_WS, logger, mnmemonicsToHexSeed, PRIVATE_STATE_STORE_NAME, PROOF_SERVER, SEED, ZK_CONFIG_PATH } from "./utils";
import { bigIntToValue } from '@midnight-ntwrk/ledger';
import { Wallet } from '@midnight-ntwrk/wallet-api';

// ===========================
// TRACE: Complete Minting Flow
// ===========================
// This file demonstrates the full workflow:
// 1. Connect to deployed contract
// 2. Owner submits proof of reserves (submitProof)
// 3. User mints tokens (mint)
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
console.log("AUDITOR-ZK MINTING FLOW TRACE");
console.log("=".repeat(80));
console.log();

// ===========================
// STEP 0: Setup Test Data
// ===========================
console.log("--- STEP 0: Preparing Test Data ---");

// Test balance: $20,912.75 = 2,091,275 cents
const TEST_BALANCE_CENTS = 2091275n;
const TEST_THRESHOLD_CENTS = 1000000n; // $10,000.00 minimum threshold
const AMOUNT_TO_MINT = 1000000n; // Mint 1,000,000 tokens

// Mock blinder from MPC protocol (32 bytes)
// In production, this comes from TLSNotary MPC encoder secret
const TEST_BLINDER = Buffer.from("mock_blinder_for_testing_32bytes", "utf-8");
const blinder32 = Buffer.alloc(32);
TEST_BLINDER.copy(blinder32);

// Create commitment: SHA256(balance_bytes || blinder)
// In Compact: (balance as Field) as Bytes<32>
// This means balance is converted to a Field (big integer) then to 32 bytes
// We need to match this by converting the u64 balance to a 32-byte representation

// Convert balance to 32-byte buffer (matching Compact's Field -> Bytes<32> conversion)
// The balance is stored as a big-endian 32-byte value with leading zeros
// const balanceBytes = Buffer.alloc(32);
// Write the u64 value in the last 8 bytes (big-endian style)
const balanceBytes = convertFieldToBytes(32, TEST_BALANCE_CENTS, "source");
console.log("balanceBytes")
console.log(balanceBytes)
console.log(Buffer.from(balanceBytes).toString())
// balanceBytes.writeBigUInt64BE(TEST_BALANCE_CENTS, 24); // offset 24 = bytes 24-31

const commitmentHash = createHash('sha256')
  .update(Buffer.concat([balanceBytes, blinder32]))
  .digest();

// Current timestamp
const timestamp = BigInt(Math.floor(Date.now() / 1000));

console.log("Test Data:");
console.log("  Balance: $" + (Number(TEST_BALANCE_CENTS) / 100).toFixed(2));
console.log("  Threshold: $" + (Number(TEST_THRESHOLD_CENTS) / 100).toFixed(2));
console.log("  Amount to Mint:", AMOUNT_TO_MINT.toString());
console.log("  Commitment:", commitmentHash.toString('hex'));
console.log("  Timestamp:", timestamp.toString());
console.log("  Blinder:", blinder32.toString('hex'));
console.log();

// ===========================
// STEP 1: Initialize Providers
// ===========================
console.log("--- STEP 1: Initializing Midnight Providers ---");

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

// Replace with your deployed contract address
// const contractAddress = "0200f2e857cbb73aa7627dba0adc9c363b913f9a7b2a4fe335d521e49e04b429a7ee";
const contractAddress = "0200dfbba52a54506889ee7bbce38e0af85d13b4e7be67cb823612e501e7b971e242"
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

console.log("Proof of Reserves:");
console.log("  Commitment:", Buffer.from(state.proofOfReserves.commitment).toString('hex'));
console.log("  Timestamp:", state.proofOfReserves.timestamp.toString());
console.log("  Threshold:", state.proofOfReserves.threshold.toString());
console.log();

console.log("Payment Config:");
console.log("  Price per Token:", state.pricePerToken.toString());
console.log();

console.log("Issuer:");
console.log("  Nullifier:", Buffer.from(state.issuerNullifier).toString('hex'));
console.log();

console.log("Balances:", state.balances.size === 0 ? "None" : Array.from(state.balances.entries()).length);
console.log();

// Warnings for initial state
if (state.minted !== 0n) {
  console.warn("⚠️  WARNING: Contract already minted (minted =", state.minted.toString() + ")");
  console.warn("   Minting operation will likely fail");
  console.log();
}

if (state.tokenInfo.totalSupply !== 0n) {
  console.warn("⚠️  WARNING: Total supply is not zero:", state.tokenInfo.totalSupply.toString());
  console.log();
}

// ===========================
// STEP 4: Submit Proof of Reserves
// ===========================
console.log("--- STEP 4: Submitting Proof of Reserves (Owner Only) ---");
console.log("This step simulates the AuditorZK owner submitting a TLSNotary attestation");
console.log();

try {
  console.log("Calling submitProof()...");
  console.log("  Commitment:", commitmentHash.toString('hex'));
  console.log("  Timestamp:", timestamp.toString());
  console.log("  Threshold: $" + (Number(TEST_THRESHOLD_CENTS) / 100).toFixed(2));
  console.log();

  const tx = await api.submitProof(
    new Uint8Array(commitmentHash),
    timestamp,
    TEST_THRESHOLD_CENTS
  );

  console.log("✓ Proof submitted successfully");
  console.log();

  // Wait for state to update
  console.log("Waiting for state update...");
  try {
    state = await waitForStateUpdate(
      api,
      null, // No tx hash from submitProof return,
      wallet,
      (s: any) => {
        const commitment = Buffer.from(s.proofOfReserves.commitment).toString('hex');
        const expectedCommitment = commitmentHash.toString('hex');
        // Check if commitment or threshold changed from initial state
        if (commitment === expectedCommitment) {
          return s;
        }
        return null;
      },
      "proof of reserves update",
      100000,
      1000
    );

    console.log();
    console.log("Updated Proof of Reserves:");
    console.log("  Commitment:", Buffer.from(state.proofOfReserves.commitment).toString('hex'));
    console.log("  Timestamp:", state.proofOfReserves.timestamp.toString());
    console.log("  Threshold:", state.proofOfReserves.threshold.toString());
    console.log();

    // Verify commitment matches
    const expectedCommitment = commitmentHash.toString('hex');
    const actualCommitment = Buffer.from(state.proofOfReserves.commitment).toString('hex');

    if (actualCommitment !== expectedCommitment) {
      console.warn("⚠️  WARNING: Commitment mismatch!");
      console.warn("   Expected:", expectedCommitment);
      console.warn("   Actual:", actualCommitment);
      console.log();
    } else {
      console.log("✓ Commitment verified");
      console.log();
    }

    if (state.proofOfReserves.threshold !== TEST_THRESHOLD_CENTS) {
      console.warn("⚠️  WARNING: Threshold mismatch!");
      console.warn("   Expected:", TEST_THRESHOLD_CENTS.toString());
      console.warn("   Actual:", state.proofOfReserves.threshold.toString());
      console.log();
    } else {
      console.log("✓ Threshold verified");
      console.log();
    }

  } catch (timeoutError) {
    console.warn("⚠️  WARNING: State update timeout");
    console.warn("   ", timeoutError instanceof Error ? timeoutError.message : String(timeoutError));
    console.warn("   State may not have updated yet. Continuing anyway...");
    console.log();
  }

} catch (error) {
  console.error("✗ submitProof() failed:");
  console.error("  Error:", error instanceof Error ? error.message : String(error));
  console.error();
  console.error("  This may be because:");
  console.error("  - You are not the contract owner (only owner can call submitProof)");
  console.error("  - Transaction failed to confirm");
  console.error();
  console.warn("⚠️  Continuing with trace, but mint may fail...");
  console.log();
}

// ===========================
// STEP 5: Mint Tokens
// ===========================
console.log("--- STEP 5: Minting Tokens (One-Time Operation) ---");
console.log("This step proves knowledge of balance and mints tokens");
console.log();

try {
  console.log("Calling mint()...");
  console.log("  Balance (PRIVATE):", TEST_BALANCE_CENTS.toString(), "cents = $" + (Number(TEST_BALANCE_CENTS) / 100).toFixed(2));
  console.log("  Blinder (PRIVATE):", blinder32.toString('hex'));
  console.log("  Amount to Mint (PUBLIC):", AMOUNT_TO_MINT.toString());
  console.log();
  const balanceBytes = await api.debugBalanceBytes(TEST_BALANCE_CENTS, blinder32);
  console.log("ZK Circuit will verify:");
  console.log("  1. hash(balance || blinder) == commitment (knowledge proof)");
  console.log("  2. balance >= threshold (", TEST_BALANCE_CENTS.toString(), ">=", TEST_THRESHOLD_CENTS.toString(), ")");
  console.log("  3. threshold >= amountToMint (", TEST_THRESHOLD_CENTS.toString(), ">=", AMOUNT_TO_MINT.toString(), ")");
  console.log("  4. minted == 0 (one-time minting)");
  console.log(balanceBytes);
  console.log(Buffer.from(balanceBytes).toString());
  waitForTxInHistory
  const mintTx = await api.mint(
    TEST_BALANCE_CENTS,
    new Uint8Array(blinder32),
    AMOUNT_TO_MINT
  );

  console.log("✓ Tokens minted successfully");
  console.log();

  // Wait for state update
  console.log("Waiting for state update...");
  try {
    state = await waitForStateUpdate(
      api,
      null,
      wallet,
      (s: any) => {
        // Check if minting has completed: minted flag set to 1 and total supply updated
        if (s.minted === 1n && s.tokenInfo.totalSupply > 0n) {
          return s;
        }
        return null;
      },
      "mint completion",
      100000,
      1000
    );

    console.log();
    console.log("Post-Mint State:");
    console.log("  Total Supply:", state.tokenInfo.totalSupply.toString());
    console.log("  Minted Flag:", state.minted.toString());
    console.log("  Issuer Nullifier:", Buffer.from(state.issuerNullifier).toString('hex'));
    console.log("  Number of Balance Entries:", state.balances.size);
    console.log();

    // Show all balances
    if (state.balances.size > 0) {
      console.log("Token Balances (Nullifier -> Amount):");
      for (const [nullifier, balance] of state.balances.entries()) {
        console.log("  ", nullifier.substring(0, 16) + "...", "->", balance.toString());
      }
      console.log();
    }

    // Verify mint results
    if (state.tokenInfo.totalSupply !== AMOUNT_TO_MINT) {
      console.warn("⚠️  WARNING: Total supply mismatch!");
      console.warn("   Expected:", AMOUNT_TO_MINT.toString());
      console.warn("   Actual:", state.tokenInfo.totalSupply.toString());
      console.log();
    } else {
      console.log("✓ Total supply verified");
      console.log();
    }

    if (state.minted !== 1n) {
      console.warn("⚠️  WARNING: Minted flag not set!");
      console.warn("   Expected: 1");
      console.warn("   Actual:", state.minted.toString());
      console.log();
    } else {
      console.log("✓ Minted flag set (no further minting allowed)");
      console.log();
    }

    const issuerNullifierHex = Buffer.from(state.issuerNullifier).toString('hex');
    const emptyNullifier = "0".repeat(64);
    if (issuerNullifierHex === emptyNullifier) {
      console.warn("⚠️  WARNING: Issuer nullifier not set!");
      console.log();
    } else {
      console.log("✓ Issuer nullifier set");
      console.log();
    }

    // Verify issuer received tokens
    let issuerBalance = 0n;
    for (const [nullifier, balance] of state.balances.entries()) {
      const nullifierHex = Buffer.from(nullifier, 'hex').toString('hex');
      if (nullifierHex === issuerNullifierHex) {
        issuerBalance = balance;
        break;
      }
    }

    if (issuerBalance !== AMOUNT_TO_MINT) {
      console.warn("⚠️  WARNING: Issuer balance mismatch!");
      console.warn("   Expected:", AMOUNT_TO_MINT.toString());
      console.warn("   Actual:", issuerBalance.toString());
      console.log();
    } else {
      console.log("✓ Issuer balance verified:", issuerBalance.toString());
      console.log();
    }

  } catch (timeoutError) {
    console.warn("⚠️  WARNING: State update timeout");
    console.warn("   ", timeoutError instanceof Error ? timeoutError.message : String(timeoutError));
    console.warn("   State may not have updated yet. Continuing anyway...");
    console.log();
  }

} catch (error) {
  console.error("✗ mint() failed:");
  console.error("  Error:", error instanceof Error ? error.message : String(error));
  console.error();
  console.error("  This may be because:");
  console.error("  - Proof of reserves not submitted (submitProof must be called first)");
  console.error("  - Commitment doesn't match (balance/blinder incorrect)");
  console.error("  - Balance < threshold (insufficient reserves)");
  console.error("  - Threshold < amountToMint (trying to mint too much)");
  console.error("  - Tokens already minted (minted == 1)");
  console.error("  - Transaction failed to confirm");
  console.error();
}

// ===========================
// STEP 6: Final State Summary
// ===========================
console.log("=".repeat(80));
console.log("FINAL CONTRACT STATE");
console.log("=".repeat(80));

state = await Rx.firstValueFrom(api.state$);

console.log();
console.log("Token Info:");
console.log("  Name:", new TextDecoder().decode(state.tokenInfo.name));
console.log("  Total Supply:", state.tokenInfo.totalSupply.toString());
console.log("  Minted:", state.minted === 1n ? "Yes (no more minting allowed)" : "No");
console.log();

console.log("Proof of Reserves:");
console.log("  Commitment:", Buffer.from(state.proofOfReserves.commitment).toString('hex'));
console.log("  Timestamp:", state.proofOfReserves.timestamp.toString(), "(" + new Date(Number(state.proofOfReserves.timestamp) * 1000).toISOString() + ")");
console.log("  Threshold: $" + (Number(state.proofOfReserves.threshold) / 100).toFixed(2));
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

console.log("=".repeat(80));
console.log("TRACE COMPLETE");
console.log("=".repeat(80));

process.exit(0);
