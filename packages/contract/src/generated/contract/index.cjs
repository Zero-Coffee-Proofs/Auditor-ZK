'use strict';
const __compactRuntime = require('@midnight-ntwrk/compact-runtime');
const expectedRuntimeVersionString = '0.8.1';
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

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(1n, 1);

class _Assertion_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment()))))));
  }
  fromValue(value_0) {
    return {
      version: _descriptor_1.fromValue(value_0),
      income: _descriptor_2.fromValue(value_0),
      debtToIncomeRatio: _descriptor_2.fromValue(value_0),
      outstandingDebt: _descriptor_2.fromValue(value_0),
      minBalance: _descriptor_2.fromValue(value_0),
      age: _descriptor_2.fromValue(value_0),
      kyc: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.version).concat(_descriptor_2.toValue(value_0.income).concat(_descriptor_2.toValue(value_0.debtToIncomeRatio).concat(_descriptor_2.toValue(value_0.outstandingDebt).concat(_descriptor_2.toValue(value_0.minBalance).concat(_descriptor_2.toValue(value_0.age).concat(_descriptor_2.toValue(value_0.kyc)))))));
  }
}

const _descriptor_3 = new _Assertion_0();

class _RuleSet_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment())))));
  }
  fromValue(value_0) {
    return {
      version: _descriptor_1.fromValue(value_0),
      monthlyIncome: _descriptor_1.fromValue(value_0),
      debtToIncomeRatio: _descriptor_1.fromValue(value_0),
      outstandingDebt: _descriptor_1.fromValue(value_0),
      minBalance: _descriptor_1.fromValue(value_0),
      minAge: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.version).concat(_descriptor_1.toValue(value_0.monthlyIncome).concat(_descriptor_1.toValue(value_0.debtToIncomeRatio).concat(_descriptor_1.toValue(value_0.outstandingDebt).concat(_descriptor_1.toValue(value_0.minBalance).concat(_descriptor_1.toValue(value_0.minAge))))));
  }
}

const _descriptor_4 = new _RuleSet_0();

class _AssertionInput_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment())))));
  }
  fromValue(value_0) {
    return {
      income: _descriptor_1.fromValue(value_0),
      debtToIncomeRatio: _descriptor_1.fromValue(value_0),
      outstandingDebt: _descriptor_1.fromValue(value_0),
      minBalance: _descriptor_1.fromValue(value_0),
      age: _descriptor_1.fromValue(value_0),
      kyc: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.income).concat(_descriptor_1.toValue(value_0.debtToIncomeRatio).concat(_descriptor_1.toValue(value_0.outstandingDebt).concat(_descriptor_1.toValue(value_0.minBalance).concat(_descriptor_1.toValue(value_0.age).concat(_descriptor_2.toValue(value_0.kyc))))));
  }
}

const _descriptor_5 = new _AssertionInput_0();

const _descriptor_6 = new __compactRuntime.CompactTypeVector(3, _descriptor_0);

const _descriptor_7 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

const _descriptor_8 = new __compactRuntime.CompactTypeBoolean();

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_9 = new _ContractAddress_0();

const _descriptor_10 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_11 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

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
      updateRules: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`updateRules: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const newRules_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('updateRules',
                                      'argument 1 (as invoked from Typescript)',
                                      'kyc.compact line 60 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        if (!(typeof(newRules_0) === 'object' && typeof(newRules_0.version) === 'bigint' && newRules_0.version >= 0n && newRules_0.version <= 18446744073709551615n && typeof(newRules_0.monthlyIncome) === 'bigint' && newRules_0.monthlyIncome >= 0n && newRules_0.monthlyIncome <= 18446744073709551615n && typeof(newRules_0.debtToIncomeRatio) === 'bigint' && newRules_0.debtToIncomeRatio >= 0n && newRules_0.debtToIncomeRatio <= 18446744073709551615n && typeof(newRules_0.outstandingDebt) === 'bigint' && newRules_0.outstandingDebt >= 0n && newRules_0.outstandingDebt <= 18446744073709551615n && typeof(newRules_0.minBalance) === 'bigint' && newRules_0.minBalance >= 0n && newRules_0.minBalance <= 18446744073709551615n && typeof(newRules_0.minAge) === 'bigint' && newRules_0.minAge >= 0n && newRules_0.minAge <= 18446744073709551615n)) {
          __compactRuntime.type_error('updateRules',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'kyc.compact line 60 char 1',
                                      'struct RuleSet<version: Uint<0..18446744073709551615>, monthlyIncome: Uint<0..18446744073709551615>, debtToIncomeRatio: Uint<0..18446744073709551615>, outstandingDebt: Uint<0..18446744073709551615>, minBalance: Uint<0..18446744073709551615>, minAge: Uint<0..18446744073709551615>>',
                                      newRules_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_4.toValue(newRules_0),
            alignment: _descriptor_4.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._updateRules_0(context,
                                             partialProofData,
                                             newRules_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      addAssertion: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`addAssertion: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const input_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.originalState != undefined && contextOrig_0.transactionContext != undefined)) {
          __compactRuntime.type_error('addAssertion',
                                      'argument 1 (as invoked from Typescript)',
                                      'kyc.compact line 67 char 1',
                                      'CircuitContext',
                                      contextOrig_0)
        }
        if (!(typeof(input_0) === 'object' && typeof(input_0.income) === 'bigint' && input_0.income >= 0n && input_0.income <= 18446744073709551615n && typeof(input_0.debtToIncomeRatio) === 'bigint' && input_0.debtToIncomeRatio >= 0n && input_0.debtToIncomeRatio <= 18446744073709551615n && typeof(input_0.outstandingDebt) === 'bigint' && input_0.outstandingDebt >= 0n && input_0.outstandingDebt <= 18446744073709551615n && typeof(input_0.minBalance) === 'bigint' && input_0.minBalance >= 0n && input_0.minBalance <= 18446744073709551615n && typeof(input_0.age) === 'bigint' && input_0.age >= 0n && input_0.age <= 18446744073709551615n && typeof(input_0.kyc) === 'bigint' && input_0.kyc >= 0n && input_0.kyc <= 1n)) {
          __compactRuntime.type_error('addAssertion',
                                      'argument 1 (argument 2 as invoked from Typescript)',
                                      'kyc.compact line 67 char 1',
                                      'struct AssertionInput<income: Uint<0..18446744073709551615>, debtToIncomeRatio: Uint<0..18446744073709551615>, outstandingDebt: Uint<0..18446744073709551615>, minBalance: Uint<0..18446744073709551615>, age: Uint<0..18446744073709551615>, kyc: Uint<0..1>>',
                                      input_0)
        }
        const context = { ...contextOrig_0 };
        const partialProofData = {
          input: {
            value: _descriptor_5.toValue(input_0),
            alignment: _descriptor_5.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._addAssertion_0(context, partialProofData, input_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData };
      },
      publicKey(context, ...args_1) {
        return { result: pureCircuits.publicKey(...args_1), context };
      },
      hasheameloPapa(context, ...args_1) {
        return { result: pureCircuits.hasheameloPapa(...args_1), context };
      },
      nullify(context, ...args_1) {
        return { result: pureCircuits.nullify(...args_1), context };
      }
    };
    this.impureCircuits = {
      updateRules: this.circuits.updateRules,
      addAssertion: this.circuits.addAssertion
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const _rules_0 = args_0[1];
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
    if (!(typeof(_rules_0) === 'object' && typeof(_rules_0.version) === 'bigint' && _rules_0.version >= 0n && _rules_0.version <= 18446744073709551615n && typeof(_rules_0.monthlyIncome) === 'bigint' && _rules_0.monthlyIncome >= 0n && _rules_0.monthlyIncome <= 18446744073709551615n && typeof(_rules_0.debtToIncomeRatio) === 'bigint' && _rules_0.debtToIncomeRatio >= 0n && _rules_0.debtToIncomeRatio <= 18446744073709551615n && typeof(_rules_0.outstandingDebt) === 'bigint' && _rules_0.outstandingDebt >= 0n && _rules_0.outstandingDebt <= 18446744073709551615n && typeof(_rules_0.minBalance) === 'bigint' && _rules_0.minBalance >= 0n && _rules_0.minBalance <= 18446744073709551615n && typeof(_rules_0.minAge) === 'bigint' && _rules_0.minAge >= 0n && _rules_0.minAge <= 18446744073709551615n)) {
      __compactRuntime.type_error('Contract state constructor',
                                  'argument 1 (argument 2 as invoked from Typescript)',
                                  'kyc.compact line 83 char 1',
                                  'struct RuleSet<version: Uint<0..18446744073709551615>, monthlyIncome: Uint<0..18446744073709551615>, debtToIncomeRatio: Uint<0..18446744073709551615>, outstandingDebt: Uint<0..18446744073709551615>, minBalance: Uint<0..18446744073709551615>, minAge: Uint<0..18446744073709551615>>',
                                  _rules_0)
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = stateValue_0;
    state_0.setOperation('updateRules', new __compactRuntime.ContractOperation());
    state_0.setOperation('addAssertion', new __compactRuntime.ContractOperation());
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
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                            alignment: _descriptor_10.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(1n),
                                                                            alignment: _descriptor_10.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue({ version: 0n, monthlyIncome: 0n, debtToIncomeRatio: 0n, outstandingDebt: 0n, minBalance: 0n, minAge: 0n }),
                                                                            alignment: _descriptor_4.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(2n),
                                                                            alignment: _descriptor_10.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newMap(
                                        new __compactRuntime.StateMap()
                                      ).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    const tmp_0 = this._nullify_0(this._secret_key_0(context, partialProofData),
                                  this._salt_0(context, partialProofData));
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(0n),
                                                                            alignment: _descriptor_10.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(1n),
                                                                            alignment: _descriptor_10.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(_rules_0),
                                                                            alignment: _descriptor_4.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    state_0.data = context.transactionContext.state;
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_7, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_6, value_0);
    return result_0;
  }
  _secret_key_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.witnessContext(ledger(context.transactionContext.state), context.currentPrivateState, context.transactionContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.secret_key(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.type_error('secret_key',
                                  'return value',
                                  'kyc.compact line 6 char 1',
                                  'Bytes<32>',
                                  result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
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
                                  'kyc.compact line 7 char 1',
                                  'Bytes<32>',
                                  result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _updateRules_0(context, partialProofData, newRules_0) {
    const caller_0 = this._nullify_0(this._secret_key_0(context,
                                                        partialProofData),
                                     this._salt_0(context, partialProofData));
    Contract._query(context,
                    partialProofData,
                    [
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_10.toValue(1n),
                                                                            alignment: _descriptor_10.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(newRules_0),
                                                                            alignment: _descriptor_4.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } }]);
    return [];
  }
  _addAssertion_0(context, partialProofData, input_0) {
    const user_0 = this._nullify_0(this._secret_key_0(context, partialProofData),
                                   this._salt_0(context, partialProofData));
    const assertion_0 = { version:
                            _descriptor_4.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_10.toValue(1n),
                                                                                                alignment: _descriptor_10.alignment() } }] } },
                                                                     { popeq: { cached: false,
                                                                                result: undefined } }]).value).version,
                          income:
                            input_0.income
                            >=
                            _descriptor_4.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_10.toValue(1n),
                                                                                                alignment: _descriptor_10.alignment() } }] } },
                                                                     { popeq: { cached: false,
                                                                                result: undefined } }]).value).monthlyIncome
                            ?
                            1n :
                            0n,
                          debtToIncomeRatio:
                            input_0.debtToIncomeRatio
                            <=
                            _descriptor_4.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_10.toValue(1n),
                                                                                                alignment: _descriptor_10.alignment() } }] } },
                                                                     { popeq: { cached: false,
                                                                                result: undefined } }]).value).debtToIncomeRatio
                            ?
                            1n :
                            0n,
                          outstandingDebt:
                            input_0.outstandingDebt
                            <=
                            _descriptor_4.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_10.toValue(1n),
                                                                                                alignment: _descriptor_10.alignment() } }] } },
                                                                     { popeq: { cached: false,
                                                                                result: undefined } }]).value).outstandingDebt
                            ?
                            1n :
                            0n,
                          minBalance:
                            input_0.minBalance
                            >=
                            _descriptor_4.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_10.toValue(1n),
                                                                                                alignment: _descriptor_10.alignment() } }] } },
                                                                     { popeq: { cached: false,
                                                                                result: undefined } }]).value).minBalance
                            ?
                            1n :
                            0n,
                          age:
                            input_0.age
                            >=
                            _descriptor_4.fromValue(Contract._query(context,
                                                                    partialProofData,
                                                                    [
                                                                     { dup: { n: 0 } },
                                                                     { idx: { cached: false,
                                                                              pushPath: false,
                                                                              path: [
                                                                                     { tag: 'value',
                                                                                       value: { value: _descriptor_10.toValue(1n),
                                                                                                alignment: _descriptor_10.alignment() } }] } },
                                                                     { popeq: { cached: false,
                                                                                result: undefined } }]).value).minAge
                            ?
                            1n :
                            0n,
                          kyc: input_0.kyc };
    Contract._query(context,
                    partialProofData,
                    [
                     { idx: { cached: false,
                              pushPath: true,
                              path: [
                                     { tag: 'value',
                                       value: { value: _descriptor_10.toValue(2n),
                                                alignment: _descriptor_10.alignment() } }] } },
                     { push: { storage: false,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(user_0),
                                                                            alignment: _descriptor_0.alignment() }).encode() } },
                     { push: { storage: true,
                               value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(assertion_0),
                                                                            alignment: _descriptor_3.alignment() }).encode() } },
                     { ins: { cached: false, n: 1 } },
                     { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _publicKey_0(sk_0) {
    return this._persistentHash_0([new Uint8Array([112, 107, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   sk_0]);
  }
  _hasheameloPapa_0(serverName_0, timestamp_0, commitment_0) {
    return this._persistentHash_1([serverName_0, timestamp_0, commitment_0]);
  }
  _nullify_0(sk_0, salt_0) {
    return this._persistentHash_1([new Uint8Array([112, 107, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   sk_0,
                                   salt_0]);
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
    get owner() {
      return _descriptor_0.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_10.toValue(0n),
                                                                                 alignment: _descriptor_10.alignment() } }] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }]).value);
    },
    get rules() {
      return _descriptor_4.fromValue(Contract._query(context,
                                                     partialProofData,
                                                     [
                                                      { dup: { n: 0 } },
                                                      { idx: { cached: false,
                                                               pushPath: false,
                                                               path: [
                                                                      { tag: 'value',
                                                                        value: { value: _descriptor_10.toValue(1n),
                                                                                 alignment: _descriptor_10.alignment() } }] } },
                                                      { popeq: { cached: false,
                                                                 result: undefined } }]).value);
    },
    assertions: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_8.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_10.toValue(2n),
                                                                                   alignment: _descriptor_10.alignment() } }] } },
                                                        'size',
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                               alignment: _descriptor_1.alignment() }).encode() } },
                                                        'eq',
                                                        { popeq: { cached: true,
                                                                   result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_10.toValue(2n),
                                                                                   alignment: _descriptor_10.alignment() } }] } },
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
                                      'kyc.compact line 58 char 1',
                                      'Bytes<32>',
                                      key_0)
        }
        return _descriptor_8.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_10.toValue(2n),
                                                                                   alignment: _descriptor_10.alignment() } }] } },
                                                        { push: { storage: false,
                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
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
                                      'kyc.compact line 58 char 1',
                                      'Bytes<32>',
                                      key_0)
        }
        return _descriptor_3.fromValue(Contract._query(context,
                                                       partialProofData,
                                                       [
                                                        { dup: { n: 0 } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_10.toValue(2n),
                                                                                   alignment: _descriptor_10.alignment() } }] } },
                                                        { idx: { cached: false,
                                                                 pushPath: false,
                                                                 path: [
                                                                        { tag: 'value',
                                                                          value: { value: _descriptor_0.toValue(key_0),
                                                                                   alignment: _descriptor_0.alignment() } }] } },
                                                        { popeq: { cached: false,
                                                                   result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[2];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_3.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
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
                                  'kyc.compact line 90 char 1',
                                  'Bytes<32>',
                                  sk_0)
    }
    return _dummyContract._publicKey_0(sk_0);
  },
  hasheameloPapa: (...args_0) => {
    if (args_0.length !== 3) {
      throw new __compactRuntime.CompactError(`hasheameloPapa: expected 3 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const serverName_0 = args_0[0];
    const timestamp_0 = args_0[1];
    const commitment_0 = args_0[2];
    if (!(serverName_0.buffer instanceof ArrayBuffer && serverName_0.BYTES_PER_ELEMENT === 1 && serverName_0.length === 32)) {
      __compactRuntime.type_error('hasheameloPapa',
                                  'argument 1',
                                  'kyc.compact line 95 char 1',
                                  'Bytes<32>',
                                  serverName_0)
    }
    if (!(timestamp_0.buffer instanceof ArrayBuffer && timestamp_0.BYTES_PER_ELEMENT === 1 && timestamp_0.length === 32)) {
      __compactRuntime.type_error('hasheameloPapa',
                                  'argument 2',
                                  'kyc.compact line 95 char 1',
                                  'Bytes<32>',
                                  timestamp_0)
    }
    if (!(commitment_0.buffer instanceof ArrayBuffer && commitment_0.BYTES_PER_ELEMENT === 1 && commitment_0.length === 32)) {
      __compactRuntime.type_error('hasheameloPapa',
                                  'argument 3',
                                  'kyc.compact line 95 char 1',
                                  'Bytes<32>',
                                  commitment_0)
    }
    return _dummyContract._hasheameloPapa_0(serverName_0,
                                            timestamp_0,
                                            commitment_0);
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
                                  'kyc.compact line 99 char 1',
                                  'Bytes<32>',
                                  sk_0)
    }
    if (!(salt_0.buffer instanceof ArrayBuffer && salt_0.BYTES_PER_ELEMENT === 1 && salt_0.length === 32)) {
      __compactRuntime.type_error('nullify',
                                  'argument 2',
                                  'kyc.compact line 99 char 1',
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
