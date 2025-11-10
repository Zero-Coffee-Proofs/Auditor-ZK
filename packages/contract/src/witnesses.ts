import { WitnessContext } from "@midnight-ntwrk/compact-runtime";
import { Ledger } from "./generated/contract/index.cjs";

export type KYCPrivateState = {
  readonly secret_key: Uint8Array;
  readonly salt: Uint8Array;
};

export const createKYCPrivateState = (
  secretKey: Uint8Array,
  salt: Uint8Array,
) => {
  return {
    secret_key: secretKey,
    salt,
  };
};
export const witnesses = {
  secret_key: ({
    privateState,
  }: WitnessContext<Ledger, KYCPrivateState>): [
      KYCPrivateState,
      Uint8Array,
    ] => [privateState, privateState.secret_key],
  salt: ({
    privateState,
  }: WitnessContext<Ledger, KYCPrivateState>): [
      KYCPrivateState,
      Uint8Array,
    ] => [privateState, privateState.salt],
};
