import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type ProofOfReserves = { commitment: Uint8Array;
                                timestamp: bigint;
                                threshold: bigint
                              };

export type TokenInfo = { name: Uint8Array; totalSupply: bigint };

export type Witnesses<T> = {
  secret_key(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
  salt(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
}

export type ImpureCircuits<T> = {
  submitProof(context: __compactRuntime.CircuitContext<T>,
              commitment_0: Uint8Array,
              timestamp_0: bigint,
              threshold_0: bigint): __compactRuntime.CircuitResults<T, []>;
  mint(context: __compactRuntime.CircuitContext<T>,
       balance_0: bigint,
       blinder_0: Uint8Array,
       amountToMint_0: bigint): __compactRuntime.CircuitResults<T, []>;
  transfer(context: __compactRuntime.CircuitContext<T>,
           toNullifier_0: Uint8Array,
           amount_0: bigint): __compactRuntime.CircuitResults<T, []>;
}

export type PureCircuits = {
  publicKey(sk_0: Uint8Array): Uint8Array;
  nullify(sk_0: Uint8Array, salt_0: Uint8Array): Uint8Array;
}

export type Circuits<T> = {
  submitProof(context: __compactRuntime.CircuitContext<T>,
              commitment_0: Uint8Array,
              timestamp_0: bigint,
              threshold_0: bigint): __compactRuntime.CircuitResults<T, []>;
  mint(context: __compactRuntime.CircuitContext<T>,
       balance_0: bigint,
       blinder_0: Uint8Array,
       amountToMint_0: bigint): __compactRuntime.CircuitResults<T, []>;
  transfer(context: __compactRuntime.CircuitContext<T>,
           toNullifier_0: Uint8Array,
           amount_0: bigint): __compactRuntime.CircuitResults<T, []>;
  publicKey(context: __compactRuntime.CircuitContext<T>, sk_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  nullify(context: __compactRuntime.CircuitContext<T>,
          sk_0: Uint8Array,
          salt_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
}

export type Ledger = {
  readonly tokenInfo: TokenInfo;
  readonly proofOfReserves: ProofOfReserves;
  readonly minted: bigint;
  balances: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): bigint;
    [Symbol.iterator](): Iterator<[Uint8Array, bigint]>
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
               _owner_0: { bytes: Uint8Array },
               _tokenName_0: Uint8Array): __compactRuntime.ConstructorResult<T>;
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
export declare const pureCircuits: PureCircuits;
