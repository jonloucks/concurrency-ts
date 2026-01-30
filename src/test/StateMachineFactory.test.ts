import { ok } from "node:assert";

import { CONTRACT, StateMachineFactory, guard } from "@jonloucks/concurrency-ts/api/StateMachineFactory";
import { assertContract, assertGuard, mockDuck } from "./helper.test";
//TODO: Replace with real import when available
import { create } from "../impl/StateMachineFactory.impl";
import { CONTRACTS } from "@jonloucks/contracts-ts";

const FUNCTION_NAMES: (string | symbol)[] = [
  'createStateMachine'
];

describe('StateMachineFactory Tests', () => {
  it('isStateMachineFactory should return true for StateMachineFactory', () => {
    const stateMachineFactory: StateMachineFactory = mockDuck<StateMachineFactory>(...FUNCTION_NAMES);
    ok(guard(stateMachineFactory), 'StateMachineFactory should return true');
  });
  it('createStateMachineFactory should create an instance', () => {
    const stateMachineFactory: StateMachineFactory = create({ contracts: CONTRACTS });
    ok(stateMachineFactory, 'StateMachineFactory instance should be created');
  });
  it('createStateMachine should create a StateMachine instance', () => {
    const stateMachineFactory: StateMachineFactory = create({ contracts: CONTRACTS });
    const stateMachine = stateMachineFactory.createStateMachine<string>({
      initialValue: 'INITIAL',
      states: ['INITIAL', 'STATE1', 'STATE2'],
      getStateRules(_) {
        return [];
      },
    });
    ok(stateMachine, 'StateMachine instance should be created');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);

assertContract(CONTRACT, 'StateMachineFactory');
