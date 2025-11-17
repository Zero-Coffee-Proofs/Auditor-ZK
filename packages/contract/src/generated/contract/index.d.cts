import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type AssertionInput = { income: bigint;
                               debtToIncomeRatio: bigint;
                               outstandingDebt: bigint;
                               minBalance: bigint;
                               age: bigint;
                               kyc: bigint
                             };

export type Assertion = { version: bigint;
                          income: bigint;
                          debtToIncomeRatio: bigint;
                          outstandingDebt: bigint;
                          minBalance: bigint;
                          age: bigint;
                          kyc: bigint
                        };

export type RuleSet = { version: bigint;
                        monthlyIncome: bigint;
                        debtToIncomeRatio: bigint;
                        outstandingDebt: bigint;
                        minBalance: bigint;
                        minAge: bigint
                      };

export type Witnesses<T> = {
  secret_key(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
  salt(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
}

export type ImpureCircuits<T> = {
  updateRules(context: __compactRuntime.CircuitContext<T>, newRules_0: RuleSet): __compactRuntime.CircuitResults<T, []>;
  addAssertion(context: __compactRuntime.CircuitContext<T>,
               input_0: AssertionInput): __compactRuntime.CircuitResults<T, []>;
}

export type PureCircuits = {
  publicKey(sk_0: Uint8Array): Uint8Array;
  hasheameloPapa(serverName_0: Uint8Array,
                 timestamp_0: Uint8Array,
                 commitment_0: Uint8Array): Uint8Array;
  nullify(sk_0: Uint8Array, salt_0: Uint8Array): Uint8Array;
}

export type Circuits<T> = {
  updateRules(context: __compactRuntime.CircuitContext<T>, newRules_0: RuleSet): __compactRuntime.CircuitResults<T, []>;
  addAssertion(context: __compactRuntime.CircuitContext<T>,
               input_0: AssertionInput): __compactRuntime.CircuitResults<T, []>;
  publicKey(context: __compactRuntime.CircuitContext<T>, sk_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  hasheameloPapa(context: __compactRuntime.CircuitContext<T>,
                 serverName_0: Uint8Array,
                 timestamp_0: Uint8Array,
                 commitment_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  nullify(context: __compactRuntime.CircuitContext<T>,
          sk_0: Uint8Array,
          salt_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
}

export type Ledger = {
  readonly owner: Uint8Array;
  readonly rules: RuleSet;
  assertions: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): Assertion;
    [Symbol.iterator](): Iterator<[Uint8Array, Assertion]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> {
  witnesses: W;
  circuits: Circuits<T>;
  impureCircuits: ImpureCircuits<T>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<T>,
               _rules_0: RuleSet): __compactRuntime.ConstructorResult<T>;
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
export declare const pureCircuits: PureCircuits;
