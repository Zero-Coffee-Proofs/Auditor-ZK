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
 * KYC SDK common types and abstractions.
 *
 * @module
 */

import { type MidnightProviders } from "@midnight-ntwrk/midnight-js-types";
import { type FoundContract } from "@midnight-ntwrk/midnight-js-contracts";
import type {
  KYCPrivateState,
  Contract,
  Witnesses,
  Assertion,
  RuleSet,
} from "contract-primitives";

export const contractPrivateStateKey = "contractPrivateState";
export type PrivateStateId = typeof contractPrivateStateKey;

/**
 * The private states consumed throughout the application.
 *
 * @remarks
 * `PrivateStates` maps the provider key to the private state shape expected
 * by the KYC contract.
 *
 * @public
 */
export type PrivateStates = {
  /**
   * Key used to provide the private state for KYC contract deployments.
   */
  readonly contractPrivateState: KYCPrivateState;
};

/**
 * Represents the KYC contract with its private state witnesses.
 *
 * @public
 */
export type ContractContract = Contract<
  KYCPrivateState,
  Witnesses<KYCPrivateState>
>;

/**
 * The keys of the circuits exported from the KYC contract.
 *
 * @public
 */
export type ContractCircuitKeys = Exclude<
  keyof ContractContract["impureCircuits"],
  number | symbol
>;

/**
 * The providers required by the KYC contract adapter.
 *
 * @public
 */
export type ContractProviders = MidnightProviders<
  ContractCircuitKeys,
  PrivateStateId,
  KYCPrivateState
>;

/**
 * A deployed KYC contract on the network.
 *
 * @public
 */
export type DeployedContractContract = FoundContract<ContractContract>;

export type ContractDerivedState = {
  readonly owner: string;
  readonly rules: RuleSet;
  readonly assertions: Map<string, Assertion>;
};

//// HELPERS

export function uint8arraytostring(array: Uint8Array): string {
  if (!array) return '';
  // Helper to convert bytes to hex (Buffer where available)
  const toHex = (bytes: Uint8Array) => {
    if (typeof Buffer !== 'undefined') return Buffer.from(bytes).toString('hex');
    return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // If exactly 16 bytes, present as UUID (8-4-4-4-12) for readability.
  if (array.length === 16) {
    const hex = toHex(array);
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  }

  return toHex(array);
}
