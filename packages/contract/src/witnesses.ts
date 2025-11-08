import { Ledger } from "./generated/contract/index.cjs";
import { WitnessContext } from "@midnight-ntwrk/compact-runtime";

export type KYCPrivateState = {
  readonly secretKey: Uint8Array;
};

export const createKYCPrivateState = (secretKey: Uint8Array) => ({
  secretKey,
});

export const witnesses = {
  localSecretKey: ({
    privateState,
  }: WitnessContext<Ledger, KYCPrivateState>): [
      KYCPrivateState,
      Uint8Array,
    ] => [privateState, privateState.secretKey],
};
