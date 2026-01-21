import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { StateMachineFactory, isStateMachineFactory, CONTRACT } from "@jonloucks/concurrency-ts/api/StateMachineFactory";
import { assertContract, assertDuck } from "./helper.test";

describe('StateMachineFactory Tests', () => {
  it('isStateMachineFactory should return true for StateMachineFactory', () => {
    const stateMachineFactory: StateMachineFactory = mock<StateMachineFactory>();
    ok(isStateMachineFactory(stateMachineFactory), 'StateMachineFactory should return true');
  });
});

assertDuck(isStateMachineFactory, 'create');

assertContract(CONTRACT, 'StateMachineFactory');
