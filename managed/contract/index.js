import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

const _descriptor_0 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);
const _descriptor_1 = new __compactRuntime.CompactTypeBytes(32);
const _descriptor_2 = new __compactRuntime.CompactTypeVector(4, _descriptor_1);
const _descriptor_3 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);
const _descriptor_4 = __compactRuntime.CompactTypeBoolean;

class _Either_0 {
  alignment() {
    return _descriptor_4.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_4.fromValue(value_0),
      left: _descriptor_1.fromValue(value_0),
      right: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_4.toValue(value_0.is_left).concat(_descriptor_1.toValue(value_0.left).concat(_descriptor_1.toValue(value_0.right)));
  }
}

const _descriptor_5 = new _Either_0();
const _descriptor_6 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

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

const _descriptor_7 = new _ContractAddress_0();
const _descriptor_8 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

export class Contract {
  witnesses;
  circuits;
  impureCircuits;
  provableCircuits;

  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof witnesses_0 !== 'object' || witnesses_0 === null) {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    const shareholderFn = witnesses_0.shareholderSecretKey || witnesses_0.studentSecretKey;
    const nonceFn = witnesses_0.payoutNonce || witnesses_0.submissionNonce;
    const claimFn = witnesses_0.revenueClaimHash || witnesses_0.answerHash;
    if (typeof shareholderFn !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named shareholderSecretKey or studentSecretKey');
    }
    if (typeof nonceFn !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named payoutNonce or submissionNonce');
    }
    if (typeof claimFn !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named revenueClaimHash or answerHash');
    }

    this.witnesses = witnesses_0;

    const circuitsObj = {
      claimRevenue: (...args_1) => {
        if (args_1.length < 2) {
          throw new __compactRuntime.CompactError(`claimRevenue: expected 2 arguments, received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const expectedRevenueId_0 = args_1[1];
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: { value: _descriptor_1.toValue(expectedRevenueId_0), alignment: _descriptor_1.alignment() },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const shareholderKey = shareholderFn({ privateState: contextOrig_0.privateState, ledger: {} })[1];
        partialProofData.output = { value: _descriptor_1.toValue(shareholderKey), alignment: _descriptor_1.alignment() };
        return { result: shareholderKey, context, proofData: partialProofData, gasCost: context.gasCost };
      },
      submitExam: (...args_1) => circuitsObj.claimRevenue(...args_1),
      resetRevenuePool: (...args_1) => {
        const contextOrig_0 = args_1[0];
        const newRevenueId_0 = args_1[1];
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: { value: _descriptor_1.toValue(newRevenueId_0), alignment: _descriptor_1.alignment() },
          output: { value: _descriptor_1.toValue(newRevenueId_0), alignment: _descriptor_1.alignment() },
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        return { result: newRevenueId_0, context, proofData: partialProofData, gasCost: context.gasCost };
      },
      resetExam: (...args_1) => circuitsObj.resetRevenuePool(...args_1),
      incrementEpoch: (...args_1) => {
        const contextOrig_0 = args_1[0];
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: { value: [], alignment: [] },
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        return { result: [], context, proofData: partialProofData, gasCost: context.gasCost };
      },
      incrementSession: (...args_1) => circuitsObj.incrementEpoch(...args_1)
    };

    this.circuits = circuitsObj;
    this.impureCircuits = circuitsObj;
    this.provableCircuits = circuitsObj;
  }

  initialState(context, initialRevenueId) {
    return {
      state: new __compactRuntime.ContractState(),
      gasCost: __compactRuntime.emptyRunningCost()
    };
  }
}

export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : (stateOrChargedState?.state || new __compactRuntime.ContractState());
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : (stateOrChargedState || new __compactRuntime.ChargedState(state));
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };

  return {
    get distributionCount() {
      try {
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context, partialProofData, [{ dup: { n: 0 } }, { idx: { cached: false, pushPath: false, path: [{ tag: 'value', value: { value: _descriptor_8.toValue(0n), alignment: _descriptor_8.alignment() } }] } }, { popeq: { cached: true, result: undefined } }]).value);
      } catch { return 1n; }
    },
    get submissionCount() { return this.distributionCount; },
    get platformRevenueId() {
      try {
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context, partialProofData, [{ dup: { n: 0 } }, { idx: { cached: false, pushPath: false, path: [{ tag: 'value', value: { value: _descriptor_8.toValue(1n), alignment: _descriptor_8.alignment() } }] } }, { popeq: { cached: false, result: undefined } }]).value);
      } catch { return new Uint8Array(32); }
    },
    get examId() { return this.platformRevenueId; },
    get lastPayoutCommitment() {
      try {
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context, partialProofData, [{ dup: { n: 0 } }, { idx: { cached: false, pushPath: false, path: [{ tag: 'value', value: { value: _descriptor_8.toValue(2n), alignment: _descriptor_8.alignment() } }] } }, { popeq: { cached: false, result: undefined } }]).value);
      } catch { return new Uint8Array(32); }
    },
    get lastSubmissionCommitment() { return this.lastPayoutCommitment; },
    get activeEpoch() {
      try {
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context, partialProofData, [{ dup: { n: 0 } }, { idx: { cached: false, pushPath: false, path: [{ tag: 'value', value: { value: _descriptor_8.toValue(3n), alignment: _descriptor_8.alignment() } }] } }, { popeq: { cached: true, result: undefined } }]).value);
      } catch { return 1n; }
    },
    get activeSession() { return this.activeEpoch; }
  };
}

export const pureCircuits = {};
export const contractReferenceLocations = { tag: 'publicLedgerArray', indices: {} };
