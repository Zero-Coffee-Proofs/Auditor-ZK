'use strict';
const __compactRuntime = require('@midnight-ntwrk/compact-runtime');
const expectedRuntimeVersionString = '0.9.0';
const expectedRuntimeVersion = expectedRuntimeVersionString.split('-')[0].split('.').map(Number);
const actualRuntimeVersion = __compactRuntime.versionString.split('-')[0].split('.').map(Number);
if (expectedRuntimeVersion[0] != actualRuntimeVersion[0]
     || (actualRuntimeVersion[0] == 0 && expectedRuntimeVersion[1] != actualRuntimeVersion[1])
     || expectedRuntimeVersion[1] > actualRuntimeVersion[1]
     || (expectedRuntimeVersion[1] == actualRuntimeVersion[1] && expectedRuntimeVersion[2] > actualRuntimeVersion[2]))
   throw new __compactRuntime.CompactError(`Version mismatch: compiled code expects ${expectedRuntimeVersionString}, runtime is ${__compactRuntime.versionString}`);
{ const MAX_FIELD = 52435875175126190479447740508185965837690552500527637822603658699938581184512n;
  if (__compactRuntime.MAX_FIELD !== MAX_FIELD)
     throw new __compactRuntime.CompactError(`compiler thinks maximum field value is ${MAX_FIELD}; run time thinks it is ${__compactRuntime.MAX_FIELD}`)
}

const _descriptor_0 = new __compactRuntime.CompactTypeBoolean();

const _descriptor_1 = new __compactRuntime.CompactTypeBytes(32);

class _ZswapCoinPublicKey_0 {
  alignment() {
    return _descriptor_1.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.bytes);
  }
}

const _descriptor_2 = new _ZswapCoinPublicKey_0();

class _ContractAddress_0 {
  alignment() {
    return _descriptor_1.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.bytes);
  }
}

const _descriptor_3 = new _ContractAddress_0();

class _Either_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_3.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_0.fromValue(value_0),
      left: _descriptor_2.fromValue(value_0),
      right: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.is_left).concat(_descriptor_2.toValue(value_0.left).concat(_descriptor_3.toValue(value_0.right)));
  }
}

const _descriptor_4 = new _Either_0();

const _descriptor_5 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_6 = new __compactRuntime.CompactTypeUnsignedInteger(1n, 1);

const _descriptor_7 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _QualifiedCoinInfo_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_7.alignment().concat(_descriptor_5.alignment())));
  }
  fromValue(value_0) {
    return {
      nonce: _descriptor_1.fromValue(value_0),
      color: _descriptor_1.fromValue(value_0),
      value: _descriptor_7.fromValue(value_0),
      mt_index: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.nonce).concat(_descriptor_1.toValue(value_0.color).concat(_descriptor_7.toValue(value_0.value).concat(_descriptor_5.toValue(value_0.mt_index))));
  }
}

const _descriptor_8 = new _QualifiedCoinInfo_0();

class _CoinInfo_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_7.alignment()));
  }
  fromValue(value_0) {
    return {
      nonce: _descriptor_1.fromValue(value_0),
      color: _descriptor_1.fromValue(value_0),
      value: _descriptor_7.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.nonce).concat(_descriptor_1.toValue(value_0.color).concat(_descriptor_7.toValue(value_0.value)));
  }
}

const _descriptor_9 = new _CoinInfo_0();

class _ProofOfReserves_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_5.alignment().concat(_descriptor_5.alignment()));
  }
  fromValue(value_0) {
    return {
      commitment: _descriptor_1.fromValue(value_0),
      timestamp: _descriptor_5.fromValue(value_0),
      threshold: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.commitment).concat(_descriptor_5.toValue(value_0.timestamp).concat(_descriptor_5.toValue(value_0.threshold)));
  }
}

const _descriptor_10 = new _ProofOfReserves_0();

const _descriptor_11 = new __compactRuntime.CompactTypeBytes(64);

class _TokenInfo_0 {
  alignment() {
    return _descriptor_11.alignment().concat(_descriptor_5.alignment());
  }
  fromValue(value_0) {
    return {
      name: _descriptor_11.fromValue(value_0),
      totalSupply: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_11.toValue(value_0.name).concat(_descriptor_5.toValue(value_0.totalSupply));
  }
}

const _descriptor_12 = new _TokenInfo_0();

const _descriptor_13 = new __compactRuntime.CompactTypeField();

const _descriptor_14 = new __compactRuntime.CompactTypeVector(2, _descriptor_1);

const _descriptor_15 = new __compactRuntime.CompactTypeVector(3, _descriptor_1);

const _descriptor_16 = new __compactRuntime.CompactTypeVector(2, _descriptor_13);

const _descriptor_17 = new __compactRuntime.CompactTypeBytes(6);

class _CoinPreimage_0 {
  alignment() {
    return _descriptor_9.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_17.alignment())));
  }
  fromValue(value_0) {
    return {
      info: _descriptor_9.fromValue(value_0),
      dataType: _descriptor_0.fromValue(value_0),
      data: _descriptor_1.fromValue(value_0),
      domain_sep: _descriptor_17.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_9.toValue(value_0.info).concat(_descriptor_0.toValue(value_0.dataType).concat(_descriptor_1.toValue(value_0.data).concat(_descriptor_17.toValue(value_0.domain_sep))));
  }
}

const _descriptor_18 = new _CoinPreimage_0();

const _descriptor_19 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.secret_key) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named secret_key');
    }
    if (typeof(witnesses_0.salt) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named salt');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      submitProof: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`submitProof: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const commitment_0 = args_1[1];
        const timestamp_0 = args_1[2];
        const threshold_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('submitProof',
                                      'argument 1 (as invoked from Typescript)',
                                      'provedToken.compact line 119 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        if (!(commitment_0.buffer instanceof ArrayBuffer && commitment_0.BYTES_PER_ELEMENT === 1 && commitment_0.length === 32)) {
          __compactRuntime.type_error('submitProof',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'provedToken.compact line 119 char 1',
                                      'Bytes<32>',
                                      commitment_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.type_error('submitProof',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'provedToken.compact line 119 char 1',
                                      'Uint<0..18446744073709551615>',
                                      timestamp_0)
        }
        if (!(typeof(threshold_0) === 'bigint' && threshold_0 >= 0n && threshold_0 <= 18446744073709551615n)) {
          __compactRuntime.type_error('submitProof',
                                      'argument 3 (argument 4 as invoked from Typescript)',
                                      'provedToken.compact line 119 char 1',
                                      'Uint<0..18446744073709551615>',
                                      threshold_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(commitment_0).concat(_descriptor_5.toValue(timestamp_0).concat(_descriptor_5.toValue(threshold_0))),
            alignment: _descriptor_1.alignment().concat(_descriptor_5.alignment().concat(_descriptor_5.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._submitProof_0(context,
                                             partialProofData,
                                             commitment_0,
                                             timestamp_0,
                                             threshold_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      mint: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`mint: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const balance_0 = args_1[1];
        const blinder_0 = args_1[2];
        const amountToMint_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('mint',
                                      'argument 1 (as invoked from Typescript)',
                                      'provedToken.compact line 155 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        if (!(typeof(balance_0) === 'bigint' && balance_0 >= 0n && balance_0 <= 18446744073709551615n)) {
          __compactRuntime.type_error('mint',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'provedToken.compact line 155 char 1',
                                      'Uint<0..18446744073709551615>',
                                      balance_0)
        }
        if (!(blinder_0.buffer instanceof ArrayBuffer && blinder_0.BYTES_PER_ELEMENT === 1 && blinder_0.length === 32)) {
          __compactRuntime.type_error('mint',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'provedToken.compact line 155 char 1',
                                      'Bytes<32>',
                                      blinder_0)
        }
        if (!(typeof(amountToMint_0) === 'bigint' && amountToMint_0 >= 0n && amountToMint_0 <= 18446744073709551615n)) {
          __compactRuntime.type_error('mint',
                                      'argument 3 (argument 4 as invoked from Typescript)',
                                      'provedToken.compact line 155 char 1',
                                      'Uint<0..18446744073709551615>',
                                      amountToMint_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_5.toValue(balance_0).concat(_descriptor_1.toValue(blinder_0).concat(_descriptor_5.toValue(amountToMint_0))),
            alignment: _descriptor_5.alignment().concat(_descriptor_1.alignment().concat(_descriptor_5.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._mint_0(context,
                                      partialProofData,
                                      balance_0,
                                      blinder_0,
                                      amountToMint_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      transfer: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`transfer: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const toNullifier_0 = args_1[1];
        const amount_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('transfer',
                                      'argument 1 (as invoked from Typescript)',
                                      'provedToken.compact line 214 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        if (!(toNullifier_0.buffer instanceof ArrayBuffer && toNullifier_0.BYTES_PER_ELEMENT === 1 && toNullifier_0.length === 32)) {
          __compactRuntime.type_error('transfer',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'provedToken.compact line 214 char 1',
                                      'Bytes<32>',
                                      toNullifier_0)
        }
        if (!(typeof(amount_0) === 'bigint' && amount_0 >= 0n && amount_0 <= 18446744073709551615n)) {
          __compactRuntime.type_error('transfer',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'provedToken.compact line 214 char 1',
                                      'Uint<0..18446744073709551615>',
                                      amount_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(toNullifier_0).concat(_descriptor_5.toValue(amount_0)),
            alignment: _descriptor_1.alignment().concat(_descriptor_5.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._transfer_0(context,
                                          partialProofData,
                                          toNullifier_0,
                                          amount_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      buy: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`buy: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const amountToBuy_0 = args_1[1];
        const payment_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('buy',
                                      'argument 1 (as invoked from Typescript)',
                                      'provedToken.compact line 258 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        if (!(typeof(amountToBuy_0) === 'bigint' && amountToBuy_0 >= 0n && amountToBuy_0 <= 18446744073709551615n)) {
          __compactRuntime.type_error('buy',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'provedToken.compact line 258 char 1',
                                      'Uint<0..18446744073709551615>',
                                      amountToBuy_0)
        }
        if (!(typeof(payment_0) === 'object' && payment_0.nonce.buffer instanceof ArrayBuffer && payment_0.nonce.BYTES_PER_ELEMENT === 1 && payment_0.nonce.length === 32 && payment_0.color.buffer instanceof ArrayBuffer && payment_0.color.BYTES_PER_ELEMENT === 1 && payment_0.color.length === 32 && typeof(payment_0.value) === 'bigint' && payment_0.value >= 0n && payment_0.value <= 340282366920938463463374607431768211455n)) {
          __compactRuntime.type_error('buy',
                                      'argument 2 (argument 3 as invoked from Typescript)',
                                      'provedToken.compact line 258 char 1',
                                      'struct CoinInfo<nonce: Bytes<32>, color: Bytes<32>, value: Uint<0..340282366920938463463374607431768211455>>',
                                      payment_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_5.toValue(amountToBuy_0).concat(_descriptor_9.toValue(payment_0)),
            alignment: _descriptor_5.alignment().concat(_descriptor_9.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._buy_0(context,
                                     partialProofData,
                                     amountToBuy_0,
                                     payment_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      publicKey(context, ...args_1) {
        return { result: pureCircuits.publicKey(...args_1), context };
      },
      nullify(context, ...args_1) {
        return { result: pureCircuits.nullify(...args_1), context };
      },
      owner: (...args_1) => {
        if (args_1.length !== 1) {
          throw new __compactRuntime.CompactError(`owner: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('owner',
                                      'argument 1 (as invoked from Typescript)',
                                      'provedToken.compact line 374 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._owner_1(context, partialProofData);
        partialProofData.output = { value: _descriptor_4.toValue(result_0), alignment: _descriptor_4.alignment() };
        return { result: result_0, context: context, proofData: partialProofData };
      }
    };
    this.impureCircuits = {
      submitProof: this.circuits.submitProof,
      mint: this.circuits.mint,
      transfer: this.circuits.transfer,
      buy: this.circuits.buy,
      owner: this.circuits.owner
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 4) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 4 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const _tokenName_0 = args_0[1];
    const _coinType_0 = args_0[2];
    const _pricePerToken_0 = args_0[3];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!(_tokenName_0.buffer instanceof ArrayBuffer && _tokenName_0.BYTES_PER_ELEMENT === 1 && _tokenName_0.length === 64)) {
      __compactRuntime.type_error('Contract state constructor',
                                  'argument 1 (argument 2 as invoked from Typescript)',
                                  'provedToken.compact line 76 char 1',
                                  'Bytes<64>',
                                  _tokenName_0)
    }
    if (!(_coinType_0.buffer instanceof ArrayBuffer && _coinType_0.BYTES_PER_ELEMENT === 1 && _coinType_0.length === 32)) {
      __compactRuntime.type_error('Contract state constructor',
                                  'argument 2 (argument 3 as invoked from Typescript)',
                                  'provedToken.compact line 76 char 1',
                                  'Bytes<32>',
                                  _coinType_0)
    }
    if (!(typeof(_pricePerToken_0) === 'bigint' && _pricePerToken_0 >= 0n && _pricePerToken_0 <= 18446744073709551615n)) {
      __compactRuntime.type_error('Contract state constructor',
                                  'argument 3 (argument 4 as invoked from Typescript)',
                                  'provedToken.compact line 76 char 1',
                                  'Uint<0..18446744073709551615>',
                                  _pricePerToken_0)
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = stateValue_0;
    state_0.setOperation('submitProof', new __compactRuntime.ContractOperation());
    state_0.setOperation('mint', new __compactRuntime.ContractOperation());
    state_0.setOperation('transfer', new __compactRuntime.ContractOperation());
    state_0.setOperation('buy', new __compactRuntime.ContractOperation());
    state_0.setOperation('owner', new __compactRuntime.ContractOperation());
    const context = {
      originalState: state_0,
      currentPrivateState: constructorContext_0.initialPrivateState,
      currentZswapLocalState: constructorContext_0.initialZswapLocalState,
      transactionContext: new __compactRuntime.QueryContext(state_0.data, __compactRuntime.dummyContractAddress())
    };
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(0n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue({ is_left: false, left: { bytes: new Uint8Array(32) }, right: { bytes: new Uint8Array(32) } }),
                                                                            alignment: _descriptor_4.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(1n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(false),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(2n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue({ name: new Uint8Array(64), totalSupply: 0n }),
                                                                            alignment: _descriptor_12.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(3n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue({ commitment: new Uint8Array(32), timestamp: 0n, threshold: 0n }),
                                                                            alignment: _descriptor_10.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(4n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(0n),
                                                                            alignment: _descriptor_6.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(5n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(6n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array(32)),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(7n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(0n),
                                                                            alignment: _descriptor_5.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(8n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array(32)),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(9n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    const own_0 = this._left_0(this._ownPublicKey_0(context, partialProofData));
    this._initialize_0(context, partialProofData, own_0);
    const tmp_0 = { name: _tokenName_0, totalSupply: 0n };
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(2n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(tmp_0),
                                                                            alignment: _descriptor_12.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    const tmp_1 = { commitment:
                      new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                    timestamp: 0n,
                    threshold: 0n };
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(3n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(tmp_1),
                                                                            alignment: _descriptor_10.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(6n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(_coinType_0),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(7n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(_pricePerToken_0),
                                                                            alignment: _descriptor_5.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    const tmp_2 = 0n;
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(4n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(tmp_2),
                                                                            alignment: _descriptor_6.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(8n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    state_0.data = context.transactionContext.state;
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _left_0(value_0) {
    return { is_left: true, left: value_0, right: { bytes: new Uint8Array(32) } };
  }
  _right_0(value_0) {
    return { is_left: false, left: { bytes: new Uint8Array(32) }, right: value_0 };
  }
  _transientHash_0(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_16, value_0);
    return result_0;
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_18, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_14, value_0);
    return result_0;
  }
  _persistentHash_2(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_15, value_0);
    return result_0;
  }
  _degradeToTransient_0(x_0) {
    const result_0 = __compactRuntime.degradeToTransient(x_0);
    return result_0;
  }
  _upgradeFromTransient_0(x_0) {
    const result_0 = __compactRuntime.upgradeFromTransient(x_0);
    return result_0;
  }
  _ownPublicKey_0(context, partialProofData) {
    const result_0 = __compactRuntime.ownPublicKey(context);
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_2.toValue(result_0),
      alignment: _descriptor_2.alignment()
    });
    return result_0;
  }
  _createZswapInput_0(context, partialProofData, coin_0) {
    const result_0 = __compactRuntime.createZswapInput(context, coin_0);
    partialProofData.privateTranscriptOutputs.push({
      value: [],
      alignment: []
    });
    return result_0;
  }
  _createZswapOutput_0(context, partialProofData, coin_0, recipient_0) {
    const result_0 = __compactRuntime.createZswapOutput(context,
                                                        coin_0,
                                                        recipient_0);
    partialProofData.privateTranscriptOutputs.push({
      value: [],
      alignment: []
    });
    return result_0;
  }
  _receive_0(context, partialProofData, coin_0) {
    const recipient_0 = this._right_0(_descriptor_3.fromValue(Contract._query(context,
                                                                              partialProofData,
                                                                              [
                                                                               { dup: { n: 2 } },
                                                                               { idx: { cached: true,
                                                                                        pushPath: false,
                                                                                        path: [
                                                                                               { tag: 'value',
                                                                                                 value: { value: _descriptor_19.toValue(0n),
                                                                                                          alignment: _descriptor_19.alignment() } }] } },
                                                                               { popeq: { cached: true,
                                                                                          result: undefined } }]).value));
    this._createZswapOutput_0(context, partialProofData, coin_0, recipient_0);
    const tmp_0 = this._coinCommitment_0(coin_0, recipient_0);
    Contract._query(context,
                    partialProofData,
                    [
                     { swap: { n: 0 } },
                     { idx: { cached: true,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_19.toValue(1n),
                                                alignment: _descriptor_19.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_0),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newNull().encode() } },
                     { ins: { cached: true, n: 2 } },
                     { swap: { n: 0 } }]);
    return [];
  }
  _mergeCoin_0(context, partialProofData, a_0, b_0) {
    const selfAddr_0 = _descriptor_3.fromValue(Contract._query(context,
                                                               partialProofData,
                                                               [
                                                                { dup: { n: 2 } },
                                                                { idx: { cached: true,
                                                                         pushPath: false,
                                                                         path: [
                                                                                { tag: 'value',
                                                                                  value: { value: _descriptor_19.toValue(0n),
                                                                                           alignment: _descriptor_19.alignment() } }] } },
                                                                { popeq: { cached: true,
                                                                           result: undefined } }]).value);
    this._createZswapInput_0(context, partialProofData, a_0);
    const tmp_0 = this._coinNullifier_0(this._downcastQualifiedCoin_0(a_0),
                                        selfAddr_0);
    Contract._query(context,
                    partialProofData,
                    [
                     { swap: { n: 0 } },
                     { idx: { cached: true,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_19.toValue(0n),
                                                alignment: _descriptor_19.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_0),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newNull().encode() } },
                     { ins: { cached: true, n: 2 } },
                     { swap: { n: 0 } }]);
    this._createZswapInput_0(context, partialProofData, b_0);
    const tmp_1 = this._coinNullifier_0(this._downcastQualifiedCoin_0(b_0),
                                        selfAddr_0);
    Contract._query(context,
                    partialProofData,
                    [
                     { swap: { n: 0 } },
                     { idx: { cached: true,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_19.toValue(0n),
                                                alignment: _descriptor_19.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_1),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newNull().encode() } },
                     { ins: { cached: true, n: 2 } },
                     { swap: { n: 0 } }]);
    __compactRuntime.assert(this._equal_0(a_0.color, b_0.color),
                            'Can only merge coins of the same color');
    const newCoin_0 = { nonce:
                          this._upgradeFromTransient_0(this._transientHash_0([__compactRuntime.convertBytesToField(28,
                                                                                                                   new Uint8Array([109, 105, 100, 110, 105, 103, 104, 116, 58, 107, 101, 114, 110, 101, 108, 58, 110, 111, 110, 99, 101, 95, 101, 118, 111, 108, 118, 101]),
                                                                                                                   '<standard library>'),
                                                                              this._degradeToTransient_0(a_0.nonce)])),
                        color: a_0.color,
                        value:
                          ((t1) => {
                            if (t1 > 340282366920938463463374607431768211455n) {
                              throw new __compactRuntime.CompactError('<standard library>: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 340282366920938463463374607431768211455');
                            }
                            return t1;
                          })(a_0.value + b_0.value) };
    this._createZswapOutput_0(context,
                              partialProofData,
                              newCoin_0,
                              this._right_0(selfAddr_0));
    const cm_0 = this._coinCommitment_0(newCoin_0, this._right_0(selfAddr_0));
    Contract._query(context,
                    partialProofData,
                    [
                     { swap: { n: 0 } },
                     { idx: { cached: true,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_19.toValue(2n),
                                                alignment: _descriptor_19.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(cm_0),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newNull().encode() } },
                     { ins: { cached: true, n: 2 } },
                     { swap: { n: 0 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { swap: { n: 0 } },
                     { idx: { cached: true,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_19.toValue(1n),
                                                alignment: _descriptor_19.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(cm_0),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newNull().encode() } },
                     { ins: { cached: true, n: 2 } },
                     { swap: { n: 0 } }]);
    return newCoin_0;
  }
  _mergeCoinImmediate_0(context, partialProofData, a_0, b_0) {
    return this._mergeCoin_0(context,
                             partialProofData,
                             a_0,
                             this._upcastQualifiedCoin_0(b_0));
  }
  _downcastQualifiedCoin_0(coin_0) {
    return { nonce: coin_0.nonce, color: coin_0.color, value: coin_0.value };
  }
  _upcastQualifiedCoin_0(coin_0) {
    return { nonce: coin_0.nonce,
             color: coin_0.color,
             value: coin_0.value,
             mt_index: 0n };
  }
  _coinCommitment_0(coin_0, recipient_0) {
    return this._persistentHash_0({ info: coin_0,
                                    dataType: recipient_0.is_left,
                                    data:
                                      recipient_0.is_left ?
                                      recipient_0.left.bytes :
                                      recipient_0.right.bytes,
                                    domain_sep:
                                      new Uint8Array([109, 100, 110, 58, 99, 99]) });
  }
  _coinNullifier_0(coin_0, addr_0) {
    return this._persistentHash_0({ info: coin_0,
                                    dataType: false,
                                    data: addr_0.bytes,
                                    domain_sep:
                                      new Uint8Array([109, 100, 110, 58, 99, 110]) });
  }
  _initialize_0(context, partialProofData, initialOwner_0) {
    this._initialize_1(context, partialProofData);
    __compactRuntime.assert(!this._isKeyOrAddressZero_0(initialOwner_0),
                            'Ownable: invalid initial owner');
    this.__transferOwnership_0(context, partialProofData, initialOwner_0);
    return [];
  }
  _owner_0(context, partialProofData) {
    this._assertInitialized_0(context, partialProofData);
    return _descriptor_4.fromValue(Contract._query(context,
                                                   partialProofData,
                                                   [
                                                    { dup: { n: 0 } },
                                                    { idx: { cached: false,
                                                             pushPath: false,
                                                             path: [
                                                                    { tag: 'value',
                                                                      value: { value: _descriptor_19.toValue(0n),
                                                                               alignment: _descriptor_19.alignment() } }] } },
                                                    { popeq: { cached: false,
                                                               result: undefined } }]).value);
  }
  _assertOnlyOwner_0(context, partialProofData) {
    this._assertInitialized_0(context, partialProofData);
    const caller_0 = this._ownPublicKey_0(context, partialProofData);
    __compactRuntime.assert(this._equal_1(caller_0,
                                          _descriptor_4.fromValue(Contract._query(context,
                                                                                  partialProofData,
                                                                                  [
                                                                                   { dup: { n: 0 } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_19.toValue(0n),
                                                                                                              alignment: _descriptor_19.alignment() } }] } },
                                                                                   { popeq: { cached: false,
                                                                                              result: undefined } }]).value).left),
                            'Ownable: caller is not the owner');
    return [];
  }
  __transferOwnership_0(context, partialProofData, newOwner_0) {
    this._assertInitialized_0(context, partialProofData);
    __compactRuntime.assert(!this._isContractAddress_0(newOwner_0),
                            'Ownable: unsafe ownership transfer');
    this.__unsafeUncheckedTransferOwnership_0(context,
                                              partialProofData,
                                              newOwner_0);
    return [];
  }
  __unsafeUncheckedTransferOwnership_0(context, partialProofData, newOwner_0) {
    this._assertInitialized_0(context, partialProofData);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(0n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(newOwner_0),
                                                                            alignment: _descriptor_4.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    return [];
  }
  _initialize_1(context, partialProofData) {
    this._assertNotInitialized_0(context, partialProofData);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(1n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(true),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    return [];
  }
  _assertInitialized_0(context, partialProofData) {
    __compactRuntime.assert(_descriptor_0.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_19.toValue(1n),
                                                                                                alignment: _descriptor_19.alignment() } }] } },
                                                                     { popeq: { cached: false,
                                                                                result: undefined } }]).value),
                            'Initializable: contract not initialized');
    return [];
  }
  _assertNotInitialized_0(context, partialProofData) {
    __compactRuntime.assert(!_descriptor_0.fromValue(Contract._query(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_19.toValue(1n),
                                                                                                 alignment: _descriptor_19.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value),
                            'Initializable: contract already initialized');
    return [];
  }
  _isKeyOrAddressZero_0(keyOrAddress_0) {
    if (this._isContractAddress_0(keyOrAddress_0)) {
      return this._equal_2({ bytes: new Uint8Array(32) }, keyOrAddress_0.right);
    } else {
      return this._equal_3({ bytes: new Uint8Array(32) }, keyOrAddress_0.left);
    }
  }
  _isContractAddress_0(keyOrAddress_0) { return !keyOrAddress_0.is_left; }
  _secret_key_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.witnessContext(ledger(context.transactionContext.state), context.currentPrivateState, context.transactionContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.secret_key(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.type_error('secret_key',
                                  'return value',
                                  'provedToken.compact line 31 char 1',
                                  'Bytes<32>',
                                  result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_1.toValue(result_0),
      alignment: _descriptor_1.alignment()
    });
    return result_0;
  }
  _salt_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.witnessContext(ledger(context.transactionContext.state), context.currentPrivateState, context.transactionContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.salt(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.type_error('salt',
                                  'return value',
                                  'provedToken.compact line 32 char 1',
                                  'Bytes<32>',
                                  result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_1.toValue(result_0),
      alignment: _descriptor_1.alignment()
    });
    return result_0;
  }
  _submitProof_0(context,
                 partialProofData,
                 commitment_0,
                 timestamp_0,
                 threshold_0)
  {
    this._assertOnlyOwner_0(context, partialProofData);
    const tmp_0 = { commitment: commitment_0,
                    timestamp: timestamp_0,
                    threshold: threshold_0 };
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(3n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(tmp_0),
                                                                            alignment: _descriptor_10.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    return [];
  }
  _mint_0(context, partialProofData, balance_0, blinder_0, amountToMint_0) {
    __compactRuntime.assert(this._equal_4(_descriptor_6.fromValue(Contract._query(context,
                                                                                  partialProofData,
                                                                                  [
                                                                                   { dup: { n: 0 } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_19.toValue(4n),
                                                                                                              alignment: _descriptor_19.alignment() } }] } },
                                                                                   { popeq: { cached: false,
                                                                                              result: undefined } }]).value),
                                          0n),
                            'Tokens already minted - only one-time minting allowed');
    const balanceValue_0 = __compactRuntime.convertFieldToBytes(32,
                                                                balance_0,
                                                                'provedToken.compact line 166 char 24');
    const computedCommitment_0 = this._persistentHash_1([balanceValue_0,
                                                         blinder_0]);
    __compactRuntime.assert(this._equal_5(computedCommitment_0,
                                          _descriptor_10.fromValue(Contract._query(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_19.toValue(3n),
                                                                                                               alignment: _descriptor_19.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value).commitment),
                            'Invalid commitment: provided balance and blinder do not match');
    __compactRuntime.assert(balance_0
                            >=
                            _descriptor_10.fromValue(Contract._query(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_19.toValue(3n),
                                                                                                 alignment: _descriptor_19.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value).threshold,
                            'Balance below required threshold - insufficient reserves');
    __compactRuntime.assert(_descriptor_10.fromValue(Contract._query(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_19.toValue(3n),
                                                                                                 alignment: _descriptor_19.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value).threshold
                            >=
                            amountToMint_0,
                            'Mint amount exceeds threshold - cannot mint more than threshold allows');
    const issuerNullifierValue_0 = this._nullify_0(this._secret_key_0(context,
                                                                      partialProofData),
                                                   this._salt_0(context,
                                                                partialProofData));
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_19.toValue(5n),
                                                alignment: _descriptor_19.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(issuerNullifierValue_0),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(amountToMint_0),
                                                                            alignment: _descriptor_5.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(8n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(issuerNullifierValue_0),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    const tmp_0 = { name:
                      _descriptor_12.fromValue(Contract._query(context,
                                                               partialProofData,
                                                               [
                                                                { dup: { n: 0 } },
                                                                { idx: { cached: false,
                                                                         pushPath: false,
                                                                         path: [
                                                                                { tag: 'value',
                                                                                  value: { value: _descriptor_19.toValue(2n),
                                                                                           alignment: _descriptor_19.alignment() } }] } },
                                                                { popeq: { cached: false,
                                                                           result: undefined } }]).value).name,
                    totalSupply: amountToMint_0 };
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(2n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_12.toValue(tmp_0),
                                                                            alignment: _descriptor_12.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_19.toValue(4n),
                                                                            alignment: _descriptor_19.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(1n),
                                                                            alignment: _descriptor_6.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    return [];
  }
  _transfer_0(context, partialProofData, toNullifier_0, amount_0) {
    const fromNullifier_0 = this._nullify_0(this._secret_key_0(context,
                                                               partialProofData),
                                            this._salt_0(context,
                                                         partialProofData));
    const toNullifierD_0 = toNullifier_0;
    const amountD_0 = amount_0;
    const senderBalance_0 = _descriptor_0.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_19.toValue(5n),
                                                                                                alignment: _descriptor_19.alignment() } }] } },
                                                                     { push: { storage: false,
                                                                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(fromNullifier_0),
                                                                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                                                                     'member',
                                                                     { popeq: { cached: true,
                                                                                result: undefined } }]).value)
                            ?
                            _descriptor_5.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_19.toValue(5n),
                                                                                                alignment: _descriptor_19.alignment() } }] } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_1.toValue(fromNullifier_0),
                                                                                                alignment: _descriptor_1.alignment() } }] } },
                                                                     { popeq: { cached: false,
                                                                                result: undefined } }]).value)
                            :
                            0n;
    __compactRuntime.assert(senderBalance_0 >= amountD_0,
                            'Insufficient balance for transfer');
    const newSenderBalance_0 = (__compactRuntime.assert(!(senderBalance_0
                                                          <
                                                          amountD_0),
                                                        'result of subtraction would be negative'),
                                senderBalance_0 - amountD_0);
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_19.toValue(5n),
                                                alignment: _descriptor_19.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(fromNullifier_0),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { rem: { cached: false } },
                     { ins: { cached: true, n: 1 } }]);
    if (newSenderBalance_0 > 0n) {
      Contract._query(context,
                      partialProofData,
                      [
                       { idx: { cached: false,
                                pushPath: true,
                                path: [
                                       { tag: 'value',
                                         value: { value: _descriptor_19.toValue(5n),
                                                  alignment: _descriptor_19.alignment() } }] } },
                       { push: { storage: false,
                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(fromNullifier_0),
                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                       { push: { storage: true,
                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(newSenderBalance_0),
                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                       { ins: { cached: false, n: 1 } },
                       { ins: { cached: true, n: 1 } }]);
    }
    const recipientBalance_0 = _descriptor_0.fromValue(Contract._query(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_19.toValue(5n),
                                                                                                   alignment: _descriptor_19.alignment() } }] } },
                                                                        { push: { storage: false,
                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(toNullifierD_0),
                                                                                                                               alignment: _descriptor_1.alignment() }).encode() } },
                                                                        'member',
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value)
                               ?
                               _descriptor_5.fromValue(Contract._query(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_19.toValue(5n),
                                                                                                   alignment: _descriptor_19.alignment() } }] } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_1.toValue(toNullifierD_0),
                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value)
                               :
                               0n;
    const newRecipientBalance_0 = ((t1) => {
                                    if (t1 > 18446744073709551615n) {
                                      throw new __compactRuntime.CompactError('provedToken.compact line 237 char 31: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                                    }
                                    return t1;
                                  })(recipientBalance_0 + amountD_0);
    if (_descriptor_0.fromValue(Contract._query(context,
                                                partialProofData,
                                                [
                                                 { dup: { n: 0 } },
                                                 { idx: { cached: false,
                                                          pushPath: false,
                                                          path: [
                                                                 { tag: 'value',
                                                                   value: { value: _descriptor_19.toValue(5n),
                                                                            alignment: _descriptor_19.alignment() } }] } },
                                                 { push: { storage: false,
                                                           value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(toNullifierD_0),
                                                                                                        alignment: _descriptor_1.alignment() }).encode() } },
                                                 'member',
                                                 { popeq: { cached: true,
                                                            result: undefined } }]).value))
    {
      Contract._query(context,
                      partialProofData,
                      [
                       { idx: { cached: false,
                                pushPath: true,
                                path: [
                                       { tag: 'value',
                                         value: { value: _descriptor_19.toValue(5n),
                                                  alignment: _descriptor_19.alignment() } }] } },
                       { push: { storage: false,
                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(toNullifierD_0),
                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                       { rem: { cached: false } },
                       { ins: { cached: true, n: 1 } }]);
    }
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_19.toValue(5n),
                                                alignment: _descriptor_19.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(toNullifierD_0),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(newRecipientBalance_0),
                                                                            alignment: _descriptor_5.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _buy_0(context, partialProofData, amountToBuy_0, payment_0) {
    __compactRuntime.assert(this._equal_6(_descriptor_6.fromValue(Contract._query(context,
                                                                                  partialProofData,
                                                                                  [
                                                                                   { dup: { n: 0 } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_19.toValue(4n),
                                                                                                              alignment: _descriptor_19.alignment() } }] } },
                                                                                   { popeq: { cached: false,
                                                                                              result: undefined } }]).value),
                                          1n),
                            'Tokens not yet minted - cannot buy');
    const amountToBuyD_0 = amountToBuy_0;
    const disclosedPayment_0 = payment_0;
    const totalPrice_0 = amountToBuyD_0
                         *
                         _descriptor_5.fromValue(Contract._query(context,
                                                                 partialProofData,
                                                                 [
                                                                  { dup: { n: 0 } },
                                                                  { idx: { cached: false,
                                                                           pushPath: false,
                                                                           path: [
                                                                                  { tag: 'value',
                                                                                    value: { value: _descriptor_19.toValue(7n),
                                                                                             alignment: _descriptor_19.alignment() } }] } },
                                                                  { popeq: { cached: false,
                                                                             result: undefined } }]).value);
    __compactRuntime.assert(this._equal_7(disclosedPayment_0.color,
                                          _descriptor_1.fromValue(Contract._query(context,
                                                                                  partialProofData,
                                                                                  [
                                                                                   { dup: { n: 0 } },
                                                                                   { idx: { cached: false,
                                                                                            pushPath: false,
                                                                                            path: [
                                                                                                   { tag: 'value',
                                                                                                     value: { value: _descriptor_19.toValue(6n),
                                                                                                              alignment: _descriptor_19.alignment() } }] } },
                                                                                   { popeq: { cached: false,
                                                                                              result: undefined } }]).value)),
                            'Wrong coin type for payment');
    __compactRuntime.assert(this._equal_8(disclosedPayment_0.value, totalPrice_0),
                            'Payment amount does not match price');
    this._receive_0(context, partialProofData, disclosedPayment_0);
    let tmp_0, tmp_1;
    const issuerBalance_0 = (tmp_0 = _descriptor_1.fromValue(Contract._query(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_19.toValue(8n),
                                                                                                         alignment: _descriptor_19.alignment() } }] } },
                                                                              { popeq: { cached: false,
                                                                                         result: undefined } }]).value),
                             _descriptor_0.fromValue(Contract._query(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_19.toValue(5n),
                                                                                                 alignment: _descriptor_19.alignment() } }] } },
                                                                      { push: { storage: false,
                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_0),
                                                                                                                             alignment: _descriptor_1.alignment() }).encode() } },
                                                                      'member',
                                                                      { popeq: { cached: true,
                                                                                 result: undefined } }]).value))
                            ?
                            (tmp_1 = _descriptor_1.fromValue(Contract._query(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_19.toValue(8n),
                                                                                                         alignment: _descriptor_19.alignment() } }] } },
                                                                              { popeq: { cached: false,
                                                                                         result: undefined } }]).value),
                             _descriptor_5.fromValue(Contract._query(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_19.toValue(5n),
                                                                                                 alignment: _descriptor_19.alignment() } }] } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_1.toValue(tmp_1),
                                                                                                 alignment: _descriptor_1.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value))
                            :
                            0n;
    __compactRuntime.assert(issuerBalance_0 >= amountToBuyD_0,
                            'Issuer has insufficient tokens for sale');
    const newIssuerBalance_0 = (__compactRuntime.assert(!(issuerBalance_0
                                                          <
                                                          amountToBuyD_0),
                                                        'result of subtraction would be negative'),
                                issuerBalance_0 - amountToBuyD_0);
    const tmp_2 = _descriptor_1.fromValue(Contract._query(context,
                                                          partialProofData,
                                                          [
                                                           { dup: { n: 0 } },
                                                           { idx: { cached: false,
                                                                    pushPath: false,
                                                                    path: [
                                                                           { tag: 'value',
                                                                             value: { value: _descriptor_19.toValue(8n),
                                                                                      alignment: _descriptor_19.alignment() } }] } },
                                                           { popeq: { cached: false,
                                                                      result: undefined } }]).value);
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_19.toValue(5n),
                                                alignment: _descriptor_19.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_2),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { rem: { cached: false } },
                     { ins: { cached: true, n: 1 } }]);
    if (newIssuerBalance_0 > 0n) {
      const tmp_3 = _descriptor_1.fromValue(Contract._query(context,
                                                            partialProofData,
                                                            [
                                                             { dup: { n: 0 } },
                                                             { idx: { cached: false,
                                                                      pushPath: false,
                                                                      path: [
                                                                             { tag: 'value',
                                                                               value: { value: _descriptor_19.toValue(8n),
                                                                                        alignment: _descriptor_19.alignment() } }] } },
                                                             { popeq: { cached: false,
                                                                        result: undefined } }]).value);
      Contract._query(context,
                      partialProofData,
                      [
                       { idx: { cached: false,
                                pushPath: true,
                                path: [
                                       { tag: 'value',
                                         value: { value: _descriptor_19.toValue(5n),
                                                  alignment: _descriptor_19.alignment() } }] } },
                       { push: { storage: false,
                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_3),
                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                       { push: { storage: true,
                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(newIssuerBalance_0),
                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                       { ins: { cached: false, n: 1 } },
                       { ins: { cached: true, n: 1 } }]);
    }
    const buyerNullifier_0 = this._nullify_0(this._secret_key_0(context,
                                                                partialProofData),
                                             this._salt_0(context,
                                                          partialProofData));
    const buyerBalance_0 = _descriptor_0.fromValue(Contract._query(context,
                                                                   partialProofData,
                                                                   [
                                                                    { dup: { n: 0 } },
                                                                    { idx: { cached: false,
                                                                             pushPath: false,
                                                                             path: [
                                                                                    { tag: 'value',
                                                                                      value: { value: _descriptor_19.toValue(5n),
                                                                                               alignment: _descriptor_19.alignment() } }] } },
                                                                    { push: { storage: false,
                                                                              value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(buyerNullifier_0),
                                                                                                                           alignment: _descriptor_1.alignment() }).encode() } },
                                                                    'member',
                                                                    { popeq: { cached: true,
                                                                               result: undefined } }]).value)
                           ?
                           _descriptor_5.fromValue(Contract._query(context,
                                                                   partialProofData,
                                                                   [
                                                                    { dup: { n: 0 } },
                                                                    { idx: { cached: false,
                                                                             pushPath: false,
                                                                             path: [
                                                                                    { tag: 'value',
                                                                                      value: { value: _descriptor_19.toValue(5n),
                                                                                               alignment: _descriptor_19.alignment() } }] } },
                                                                    { idx: { cached: false,
                                                                             pushPath: false,
                                                                             path: [
                                                                                    { tag: 'value',
                                                                                      value: { value: _descriptor_1.toValue(buyerNullifier_0),
                                                                                               alignment: _descriptor_1.alignment() } }] } },
                                                                    { popeq: { cached: false,
                                                                               result: undefined } }]).value)
                           :
                           0n;
    const newBuyerBalance_0 = ((t1) => {
                                if (t1 > 18446744073709551615n) {
                                  throw new __compactRuntime.CompactError('provedToken.compact line 289 char 27: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                                }
                                return t1;
                              })(buyerBalance_0 + amountToBuyD_0);
    if (_descriptor_0.fromValue(Contract._query(context,
                                                partialProofData,
                                                [
                                                 { dup: { n: 0 } },
                                                 { idx: { cached: false,
                                                          pushPath: false,
                                                          path: [
                                                                 { tag: 'value',
                                                                   value: { value: _descriptor_19.toValue(5n),
                                                                            alignment: _descriptor_19.alignment() } }] } },
                                                 { push: { storage: false,
                                                           value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(buyerNullifier_0),
                                                                                                        alignment: _descriptor_1.alignment() }).encode() } },
                                                 'member',
                                                 { popeq: { cached: true,
                                                            result: undefined } }]).value))
    {
      Contract._query(context,
                      partialProofData,
                      [
                       { idx: { cached: false,
                                pushPath: true,
                                path: [
                                       { tag: 'value',
                                         value: { value: _descriptor_19.toValue(5n),
                                                  alignment: _descriptor_19.alignment() } }] } },
                       { push: { storage: false,
                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(buyerNullifier_0),
                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                       { rem: { cached: false } },
                       { ins: { cached: true, n: 1 } }]);
    }
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_19.toValue(5n),
                                                alignment: _descriptor_19.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(buyerNullifier_0),
                                                                            alignment: _descriptor_1.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(newBuyerBalance_0),
                                                                            alignment: _descriptor_5.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    let tmp_4;
    const existingPayment_0 = (tmp_4 = disclosedPayment_0.color,
                               _descriptor_0.fromValue(Contract._query(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_19.toValue(9n),
                                                                                                   alignment: _descriptor_19.alignment() } }] } },
                                                                        { push: { storage: false,
                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_4),
                                                                                                                               alignment: _descriptor_1.alignment() }).encode() } },
                                                                        'member',
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value));
    if (existingPayment_0) {
      let tmp_5;
      const existing_0 = (tmp_5 = disclosedPayment_0.color,
                          _descriptor_8.fromValue(Contract._query(context,
                                                                  partialProofData,
                                                                  [
                                                                   { dup: { n: 0 } },
                                                                   { idx: { cached: false,
                                                                            pushPath: false,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_19.toValue(9n),
                                                                                              alignment: _descriptor_19.alignment() } }] } },
                                                                   { idx: { cached: false,
                                                                            pushPath: false,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_1.toValue(tmp_5),
                                                                                              alignment: _descriptor_1.alignment() } }] } },
                                                                   { popeq: { cached: false,
                                                                              result: undefined } }]).value));
      const merged_0 = this._mergeCoinImmediate_0(context,
                                                  partialProofData,
                                                  existing_0,
                                                  disclosedPayment_0);
      const tmp_6 = disclosedPayment_0.color;
      Contract._query(context,
                      partialProofData,
                      [
                       { idx: { cached: false,
                                pushPath: true,
                                path: [
                                       { tag: 'value',
                                         value: { value: _descriptor_19.toValue(9n),
                                                  alignment: _descriptor_19.alignment() } }] } },
                       { push: { storage: false,
                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_6),
                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                       { rem: { cached: false } },
                       { ins: { cached: true, n: 1 } }]);
      const tmp_7 = disclosedPayment_0.color;
      const tmp_8 = this._right_0(_descriptor_3.fromValue(Contract._query(context,
                                                                          partialProofData,
                                                                          [
                                                                           { dup: { n: 2 } },
                                                                           { idx: { cached: true,
                                                                                    pushPath: false,
                                                                                    path: [
                                                                                           { tag: 'value',
                                                                                             value: { value: _descriptor_19.toValue(0n),
                                                                                                      alignment: _descriptor_19.alignment() } }] } },
                                                                           { popeq: { cached: true,
                                                                                      result: undefined } }]).value));
      __compactRuntime.hasCoinCommitment(context, merged_0, tmp_8) ? Contract._query(context,
                                                                                     partialProofData,
                                                                                     [
                                                                                      { idx: { cached: false,
                                                                                               pushPath: true,
                                                                                               path: [
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_19.toValue(9n),
                                                                                                                 alignment: _descriptor_19.alignment() } }] } },
                                                                                      { push: { storage: false,
                                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_7),
                                                                                                                                             alignment: _descriptor_1.alignment() }).encode() } },
                                                                                      { dup: { n: 5 } },
                                                                                      { push: { storage: false,
                                                                                                value: __compactRuntime.StateValue.newCell(__compactRuntime.coinCommitment(
                                                                                                                                             { value: _descriptor_9.toValue(merged_0),
                                                                                                                                               alignment: _descriptor_9.alignment() },
                                                                                                                                             { value: _descriptor_4.toValue(tmp_8),
                                                                                                                                               alignment: _descriptor_4.alignment() }
                                                                                                                                           )).encode() } },
                                                                                      { idx: { cached: true,
                                                                                               pushPath: false,
                                                                                               path: [
                                                                                                      { tag: 'value',
                                                                                                        value: { value: _descriptor_19.toValue(1n),
                                                                                                                 alignment: _descriptor_19.alignment() } },
                                                                                                      { tag: 'stack' }] } },
                                                                                      { push: { storage: false,
                                                                                                value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(merged_0),
                                                                                                                                             alignment: _descriptor_9.alignment() }).encode() } },
                                                                                      { swap: { n: 0 } },
                                                                                      { concat: { cached: true,
                                                                                                  n: 91 } },
                                                                                      { ins: { cached: false,
                                                                                               n: 1 } },
                                                                                      { ins: { cached: true,
                                                                                               n: 1 } }]) : (() => { throw new __compactRuntime.CompactError(`provedToken.compact line 304 char 5: Coin commitment not found. Check the coin has been received (or call 'createZswapOutput')`); })();
    } else {
      const tmp_9 = disclosedPayment_0.color;
      const tmp_10 = this._right_0(_descriptor_3.fromValue(Contract._query(context,
                                                                           partialProofData,
                                                                           [
                                                                            { dup: { n: 2 } },
                                                                            { idx: { cached: true,
                                                                                     pushPath: false,
                                                                                     path: [
                                                                                            { tag: 'value',
                                                                                              value: { value: _descriptor_19.toValue(0n),
                                                                                                       alignment: _descriptor_19.alignment() } }] } },
                                                                            { popeq: { cached: true,
                                                                                       result: undefined } }]).value));
      __compactRuntime.hasCoinCommitment(context, disclosedPayment_0, tmp_10) ? Contract._query(context,
                                                                                                partialProofData,
                                                                                                [
                                                                                                 { idx: { cached: false,
                                                                                                          pushPath: true,
                                                                                                          path: [
                                                                                                                 { tag: 'value',
                                                                                                                   value: { value: _descriptor_19.toValue(9n),
                                                                                                                            alignment: _descriptor_19.alignment() } }] } },
                                                                                                 { push: { storage: false,
                                                                                                           value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(tmp_9),
                                                                                                                                                        alignment: _descriptor_1.alignment() }).encode() } },
                                                                                                 { dup: { n: 5 } },
                                                                                                 { push: { storage: false,
                                                                                                           value: __compactRuntime.StateValue.newCell(__compactRuntime.coinCommitment(
                                                                                                                                                        { value: _descriptor_9.toValue(disclosedPayment_0),
                                                                                                                                                          alignment: _descriptor_9.alignment() },
                                                                                                                                                        { value: _descriptor_4.toValue(tmp_10),
                                                                                                                                                          alignment: _descriptor_4.alignment() }
                                                                                                                                                      )).encode() } },
                                                                                                 { idx: { cached: true,
                                                                                                          pushPath: false,
                                                                                                          path: [
                                                                                                                 { tag: 'value',
                                                                                                                   value: { value: _descriptor_19.toValue(1n),
                                                                                                                            alignment: _descriptor_19.alignment() } },
                                                                                                                 { tag: 'stack' }] } },
                                                                                                 { push: { storage: false,
                                                                                                           value: __compactRuntime.StateValue.newCell({ value: _descriptor_9.toValue(disclosedPayment_0),
                                                                                                                                                        alignment: _descriptor_9.alignment() }).encode() } },
                                                                                                 { swap: { n: 0 } },
                                                                                                 { concat: { cached: true,
                                                                                                             n: 91 } },
                                                                                                 { ins: { cached: false,
                                                                                                          n: 1 } },
                                                                                                 { ins: { cached: true,
                                                                                                          n: 1 } }]) : (() => { throw new __compactRuntime.CompactError(`provedToken.compact line 307 char 5: Coin commitment not found. Check the coin has been received (or call 'createZswapOutput')`); })();
    }
    return [];
  }
  _publicKey_0(sk_0) {
    return this._persistentHash_1([new Uint8Array([112, 107, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   sk_0]);
  }
  _nullify_0(sk_0, salt_0) {
    return this._persistentHash_2([new Uint8Array([112, 107, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   sk_0,
                                   salt_0]);
  }
  _owner_1(context, partialProofData) {
    return this._owner_0(context, partialProofData);
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    {
      let x1 = x0.bytes;
      let y1 = y0.bytes;
      if (!x1.every((x, i) => y1[i] === x)) { return false; }
    }
    return true;
  }
  _equal_2(x0, y0) {
    {
      let x1 = x0.bytes;
      let y1 = y0.bytes;
      if (!x1.every((x, i) => y1[i] === x)) { return false; }
    }
    return true;
  }
  _equal_3(x0, y0) {
    {
      let x1 = x0.bytes;
      let y1 = y0.bytes;
      if (!x1.every((x, i) => y1[i] === x)) { return false; }
    }
    return true;
  }
  _equal_4(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_7(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_8(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  static _query(context, partialProofData, prog) {
    var res;
    try {
      res = context.transactionContext.query(prog, __compactRuntime.CostModel.dummyCostModel());
    } catch (err) {
      throw new __compactRuntime.CompactError(err.toString());
    }
    context.transactionContext = res.context;
    var reads = res.events.filter((e) => e.tag === 'read');
    var i = 0;
    partialProofData.publicTranscript = partialProofData.publicTranscript.concat(prog.map((op) => {
      if(typeof(op) === 'object' && 'popeq' in op) {
        return { popeq: {
          ...op.popeq,
          result: reads[i++].content,
        } };
      } else {
        return op;
      }
    }));
    if(res.events.length == 1 && res.events[0].tag === 'read') {
      return res.events[0].content;
    } else {
      return res.events;
    }
  }
}
function ledger(state) {
  const context = {
    originalState: state,
    transactionContext: new __compactRuntime.QueryContext(state, __compactRuntime.dummyContractAddress())
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get tokenInfo() {
      return _descriptor_12.fromValue(Contract._query(context,
                                                      partialProofData,
                                                      [
                                                       { dup: { n: 0 } },
                                                       { idx: { cached: false,
                                                                pushPath: false,
                                                                path: [
                                                                       { tag: 'value',
                                                                         value: { value: _descriptor_19.toValue(2n),
                                                                                  alignment: _descriptor_19.alignment() } }] } },
                                                       { popeq: { cached: false,
                                                                  result: undefined } }]).value);
    },
    get proofOfReserves() {
      return _descriptor_10.fromValue(Contract._query(context,
                                                      partialProofData,
                                                      [
                                                       { dup: { n: 0 } },
                                                       { idx: { cached: false,
                                                                pushPath: false,
                                                                path: [
                                                                       { tag: 'value',
                                                                         value: { value: _descriptor_19.toValue(3n),
                                                                                  alignment: _descriptor_19.alignment() } }] } },
                                                       { popeq: { cached: false,
                                                                  result: undefined } }]).value);
    },
    get minted() {
      return _descriptor_6.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_19.toValue(4n),
                                                                                 alignment: _descriptor_19.alignment() } }] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }]).value);
    },
    balances: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_0.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_19.toValue(5n),
                                                                                   alignment: _descriptor_19.alignment() } }] } },
                                                        'size',
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(0n),
                                                                                                               alignment: _descriptor_5.alignment() }).encode() } },
                                                        'eq',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_5.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_19.toValue(5n),
                                                                                   alignment: _descriptor_19.alignment() } }] } },
                                                        'size',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.type_error('member',
                                      'argument 1',
                                      'provedToken.compact line 56 char 1',
                                      'Bytes<32>',
                                      key_0)
        }
        return _descriptor_0.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_19.toValue(5n),
                                                                                   alignment: _descriptor_19.alignment() } }] } },
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(key_0),
                                                                                                               alignment: _descriptor_1.alignment() }).encode() } },
                                                        'member',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.type_error('lookup',
                                      'argument 1',
                                      'provedToken.compact line 56 char 1',
                                      'Bytes<32>',
                                      key_0)
        }
        return _descriptor_5.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_19.toValue(5n),
                                                                                   alignment: _descriptor_19.alignment() } }] } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_1.toValue(key_0),
                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                        { popeq: { cached: false,
                                                                   result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[5];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_1.fromValue(key.value),      _descriptor_5.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    get expectedCoinType() {
      return _descriptor_1.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_19.toValue(6n),
                                                                                 alignment: _descriptor_19.alignment() } }] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }]).value);
    },
    get pricePerToken() {
      return _descriptor_5.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_19.toValue(7n),
                                                                                 alignment: _descriptor_19.alignment() } }] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }]).value);
    },
    get issuerNullifier() {
      return _descriptor_1.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_19.toValue(8n),
                                                                                 alignment: _descriptor_19.alignment() } }] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }]).value);
    }
  };
}
const _emptyContext = {
  originalState: new __compactRuntime.ContractState(),
  transactionContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  secret_key: (...args) => undefined, salt: (...args) => undefined
});
const pureCircuits = {
  publicKey: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`publicKey: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.type_error('publicKey',
                                  'argument 1',
                                  'provedToken.compact line 356 char 1',
                                  'Bytes<32>',
                                  sk_0)
    }
    return _dummyContract._publicKey_0(sk_0);
  },
  nullify: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`nullify: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    const salt_0 = args_0[1];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.type_error('nullify',
                                  'argument 1',
                                  'provedToken.compact line 370 char 1',
                                  'Bytes<32>',
                                  sk_0)
    }
    if (!(salt_0.buffer instanceof ArrayBuffer && salt_0.BYTES_PER_ELEMENT === 1 && salt_0.length === 32)) {
      __compactRuntime.type_error('nullify',
                                  'argument 2',
                                  'provedToken.compact line 370 char 1',
                                  'Bytes<32>',
                                  salt_0)
    }
    return _dummyContract._nullify_0(sk_0, salt_0);
  }
};
const contractReferenceLocations = { tag: 'publicLedgerArray', indices: { } };
exports.Contract = Contract;
exports.ledger = ledger;
exports.pureCircuits = pureCircuits;
exports.contractReferenceLocations = contractReferenceLocations;
//# sourceMappingURL=index.cjs.map
