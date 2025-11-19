// This file is part of AuditorZK proof-of-reserves project
// Copyright (C) 2025 Midnight Foundation
// SPDX-License-Identifier: Apache-2.0

/**
 * ProvedToken SDK adapter.
 *
 * @packageDocumentation
 */

import {
  createTokenPrivateState,
  TokenPrivateState,
  witnesses,
  Contract,
  ledger,
  ProofOfReserves,
  TokenInfo,
  pureCircuits
} from 'contracts';
import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { type Logger } from 'pino';
import {
  type ContractDerivedState,
  type ContractContract,
  type ContractProviders,
  type DeployedContractContract,
  contractPrivateStateKey,
  uint8arraytostring,
} from './common-types';

import { CallResultPublic, deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { combineLatest, map, from, type Observable } from 'rxjs';
import * as utils from './utils';
import { FinalizedTxData } from '@midnight-ntwrk/midnight-js-types';

/** @internal */
const contractContractInstance: ContractContract = new Contract(witnesses);

/**
 * Public API for a deployed ProvedToken contract.
 */
export interface DeployedContractAPI {
  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<ContractDerivedState>;

  submitProof: (commitment: Uint8Array, timestamp: bigint, threshold: bigint) => Promise< CallResultPublic & FinalizedTxData>;
  mint: (balance: bigint, blinder: Uint8Array, amountToMint: bigint) => Promise< CallResultPublic & FinalizedTxData>;
  transfer: (toNullifier: Uint8Array, amount: bigint) => Promise<void>;
  buy: (amountToBuy: bigint, payment: { nonce: Uint8Array, color: Uint8Array, value: bigint }) => Promise<void>;
  debugBalanceBytes: (balance: bigint, blinder: Uint8Array) => Promise<Uint8Array>;
}

export class ContractAPI implements DeployedContractAPI {
  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<ContractDerivedState>;

  private constructor(
    public readonly deployedContract: DeployedContractContract,
    providers: ContractProviders,
    private readonly logger?: Logger,
  ) {
    this.deployedContractAddress = deployedContract.deployTxData.public.contractAddress;

    this.state$ = combineLatest([
      providers.publicDataProvider
        .contractStateObservable(this.deployedContractAddress, { type: 'latest' })
        .pipe(map((contractState) => ledger(contractState.data))),
      from(providers.privateStateProvider.get(contractPrivateStateKey) as Promise<any>),
    ]).pipe(
      map(([ledgerState, privateState]) => {
        // Extract balances map from ledger
        const balances = new Map<string, bigint>();
        for (const [k, v] of (ledgerState as any).balances) {
          balances.set(uint8arraytostring(k as Uint8Array), v as bigint);
        }

        return {
          tokenInfo: (ledgerState as any).tokenInfo as TokenInfo,
          proofOfReserves: (ledgerState as any).proofOfReserves as ProofOfReserves,
          minted: (ledgerState as any).minted as bigint,
          balances,
          expectedCoinType: (ledgerState as any).expectedCoinType as Uint8Array,
          pricePerToken: (ledgerState as any).pricePerToken as bigint,
          issuerNullifier: (ledgerState as any).issuerNullifier as Uint8Array,
        };
      }),
    );
  }

  async submitProof(commitment: Uint8Array, timestamp: bigint, threshold: bigint): Promise<any> {
    this.logger?.info('submitting proof of reserves');
    const tx = await this.deployedContract.callTx.submitProof(commitment, timestamp, threshold);
    this.logger?.trace({ tx: tx.public });
    return tx.public;
  }

  async mint(balance: bigint, blinder: Uint8Array, amountToMint: bigint): Promise<any> {
    this.logger?.info('minting tokens');
    const tx = await this.deployedContract.callTx.mint(balance, blinder, amountToMint);
    this.logger?.trace({ tx: tx.public });
    return tx.public;
  }

  async transfer(toNullifier: Uint8Array, amount: bigint): Promise<void> {
    this.logger?.info('transferring tokens');
    const tx = await this.deployedContract.callTx.transfer(toNullifier, amount);
    this.logger?.trace({ tx: tx.public });
  }

  async buy(amountToBuy: bigint, payment: { nonce: Uint8Array, color: Uint8Array, value: bigint }): Promise<void> {
    this.logger?.info('buying tokens');
    const tx = await this.deployedContract.callTx.buy(amountToBuy, payment);
    this.logger?.trace({ tx: tx.public });
  }

  async debugBalanceBytes(balance: bigint, blinder: Uint8Array): Promise<Uint8Array> {
    this.logger?.info('debugging balance bytes conversion');
    const bytes = await pureCircuits.debugCommitment(balance, blinder);
    this.logger?.trace({ bytes: bytes });
    // The circuit returns Bytes<32>, extract from transaction result
    return bytes as Uint8Array;
  }

  async getOwner(): Promise<{ is_left: boolean; left: { bytes: Uint8Array }; right: { bytes: Uint8Array } }> {
    this.logger?.info('querying contract owner');
    const result = await this.deployedContract.callTx.owner();
    this.logger?.trace(result)
    this.logger?.trace({ owner: result.private.result });
    // Circuit return values are in result.private.result
    return result.private.result as { is_left: boolean; left: { bytes: Uint8Array }; right: { bytes: Uint8Array } };
  }

  static async deploy(
    providers: ContractProviders,
    tokenName: string,
    pricePerToken: bigint,
    logger: Logger | undefined,
  ): Promise<ContractAPI> {
    logger?.info('deployContract');

    // Pad token name to 64 bytes
    const tokenNameBytes = new Uint8Array(64);
    const nameBytes = new TextEncoder().encode(tokenName);
    tokenNameBytes.set(nameBytes.slice(0, Math.min(nameBytes.length, 64)));

    const initialPrivateState = await ContractAPI.getPrivateState(providers);

    const deployed = await deployContract(providers, {
      privateStateId: contractPrivateStateKey,
      contract: contractContractInstance,
      initialPrivateState,
      args: [tokenNameBytes, pricePerToken],
    });

    return new ContractAPI(deployed, providers, logger);
  }

  static async join(
    providers: ContractProviders,
    contractAddress: ContractAddress,
    logger: Logger | undefined,
  ): Promise<ContractAPI> {

    const initialPrivateState = await ContractAPI.getPrivateState(providers);

    const deployed = await findDeployedContract<ContractContract>(providers, {
      contractAddress,
      contract: contractContractInstance,
      privateStateId: contractPrivateStateKey,
      initialPrivateState,
    });

    return new ContractAPI(deployed, providers, logger);
  }

  private static async getPrivateState(providers: ContractProviders): Promise<TokenPrivateState> {
    // Use hardcoded secret_key and salt (32 bytes each)
    // In production, these would be derived from user's wallet or securely generated
    const secretKey = Buffer.from("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "hex");
    const salt = Buffer.from("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "hex");

    const newPrivateState = createTokenPrivateState(secretKey, salt);
    console.log("Created private state with hardcoded secret_key and salt");

    // Persist the private state so subsequent joins reuse it
    try {
      await providers.privateStateProvider.set(contractPrivateStateKey, newPrivateState);
    } catch (e) {
      console.warn('Warning: failed to persist private state; proceeding with ephemeral state');
    }

    return newPrivateState;
  }
}

export * from './common-types.js';
export * as utils from './utils.js';
