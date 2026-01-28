import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { CONTRACT, StateMachineFactory, guard } from "@jonloucks/concurrency-ts/api/StateMachineFactory";
import { assertContract, assertGuard } from "./helper.test";
//TODO: Replace with real import when available
import { create } from "../impl/StateMachineFactory.impl";

describe('StateMachineFactory Tests', () => {
  it('isStateMachineFactory should return true for StateMachineFactory', () => {
    const stateMachineFactory: StateMachineFactory = mock<StateMachineFactory>();
    ok(guard(stateMachineFactory), 'StateMachineFactory should return true');
  });
  it('createStateMachineFactory should create an instance', () => {
    const stateMachineFactory: StateMachineFactory = create();
    ok(stateMachineFactory, 'StateMachineFactory instance should be created');
  });
  it ('createStateMachine should create a StateMachine instance', () => {
    const stateMachineFactory: StateMachineFactory = create();
    const stateMachine = stateMachineFactory.createStateMachine<string>({
      initialValue: 'INITIAL',
      states: ['INITIAL', 'STATE1', 'STATE2'],
      getStateRules(state) {
        return [];
      },
    });
    ok(stateMachine, 'StateMachine instance should be created');
  });
});

assertGuard(guard, 'createStateMachine');

assertContract(CONTRACT, 'StateMachineFactory');
