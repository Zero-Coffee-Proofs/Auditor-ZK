// This file is part of midnightntwrk/example-counter.
// Copyright (C) 2025 Midnight Foundation
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * KYC SDK adapter.
 *
 * @packageDocumentation
 */

import {
  createKYCPrivateState,
  KYCPrivateState,
  witnesses,
  Contract,
  ledger,
  Assertion,
  RuleSet,
  AssertionInput,
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

import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { combineLatest, map, from, type Observable } from 'rxjs';
import * as utils from './utils';
import { fromHex } from '@midnight-ntwrk/midnight-js-utils';


/** @internal */
const contractContractInstance: ContractContract = new Contract(witnesses);

/**
 * Public API for a deployed KYC contract.
 */
export interface DeployedContractAPI {
  readonly deployedContractAddress: ContractAddress;
  readonly state$: Observable<ContractDerivedState>;

  updateRules: (newRules: RuleSet) => Promise<void>;
  addAssertion: (input: AssertionInput) => Promise<void>;
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
        const assertions = new Map<string, Assertion>();
        for (const [k, v] of ledgerState.assertions) {
          assertions.set(uint8arraytostring(k as Uint8Array), v as Assertion);
        }

        return {
          owner: uint8arraytostring(ledgerState.owner),
          rules: ledgerState.rules as RuleSet,
          assertions,
        };
      }),
    );
  }

  async updateRules(newRules: RuleSet): Promise<void> {
    this.logger?.info('updating rules');
    const tx = await this.deployedContract.callTx.updateRules(newRules);
    this.logger?.trace({ tx: tx.public });
  }

  async addAssertion(input: AssertionInput): Promise<void> {
    this.logger?.info('adding assertion');
    const tx = await this.deployedContract.callTx.addAssertion(input);
    this.logger?.trace({ tx: tx.public });
  }

  static async deploy(
    providers: ContractProviders,
    logger: Logger | undefined,
  ): Promise<ContractAPI> {
    logger?.info('deployContract');

    const initialRules: RuleSet = {
      version: 1n,
      monthlyIncome: 2000n,
      debtToIncomeRatio: 40n,
      outstandingDebt: 0n,
      minBalance: 0n,
      minAge: 18n,
    };


    console.log("Gettting private state")

    const initialPrivateState = await ContractAPI.getPrivateState(providers);

    const deployed = await deployContract(providers, {
      privateStateId: contractPrivateStateKey,
      contract: contractContractInstance,
      initialPrivateState,
      args: [initialRules],
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

  private static async getPrivateState(providers: ContractProviders): Promise<KYCPrivateState> {
    // Try to reuse an existing persisted private state
    //const existingPrivateState = await providers.privateStateProvider.get(contractPrivateStateKey);
    //console.log("PRivate state doesnt exist")
    //if (existingPrivateState != null) return existingPrivateState;

    // For flexibility we generate a random salt here; callers could be extended to pass a salt as well.
    //const salt = utils.randomBytes(32);
    //console.log("Creating private state")

    //console.log(fromHex(providers.walletProvider.coinPublicKey))
    const newPrivateState = createKYCPrivateState(Buffer.from("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", "hex"), Buffer.from("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 'hex'));
    console.log("New private state", newPrivateState)

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

