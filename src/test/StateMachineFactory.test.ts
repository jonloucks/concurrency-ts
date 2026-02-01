import { ok } from "node:assert";

import { CONTRACT, StateMachineFactory, guard } from "@jonloucks/concurrency-ts/api/StateMachineFactory";
import { Concurrency, createConcurrency } from "@jonloucks/concurrency-ts";
import { AutoClose, Contracts, CONTRACTS } from "@jonloucks/contracts-ts";

import { assertContract, assertGuard } from "./helper.test";

const FUNCTION_NAMES: (string | symbol)[] = [
  'createStateMachine'
];

assertGuard(guard, ...FUNCTION_NAMES);

assertContract(CONTRACT, 'StateMachineFactory');

describe('StateMachineFactory Tests', () => {
  let contracts: Contracts = CONTRACTS;
  let concurrency: Concurrency;
  let closeConcurrency: AutoClose;
  let factory: StateMachineFactory;

  beforeEach(() => {
    concurrency = createConcurrency({ contracts: contracts });
    closeConcurrency = concurrency.open();
    factory = contracts.enforce(CONTRACT);
  });

  afterEach(() => {
    closeConcurrency.close();
  });

  it('isStateMachineFactory should return true for StateMachineFactory', () => {
    ok(guard(factory), 'StateMachineFactory should return true');
  });
  it('createStateMachine should create a StateMachine instance', () => {
    const stateMachine = factory.createStateMachine<string>({
      initialValue: 'INITIAL',
      states: ['INITIAL', 'STATE1', 'STATE2'],
      getStateRules(_) {
        return [];
      },
    });
    ok(stateMachine, 'StateMachine instance should be created');
  });
});
