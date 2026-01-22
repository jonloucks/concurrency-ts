import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { CONTRACT, StateMachineFactory, guard } from "@jonloucks/concurrency-ts/api/StateMachineFactory";
import { assertContract, assertGuard } from "./helper.test";

describe('StateMachineFactory Tests', () => {
  it('isStateMachineFactory should return true for StateMachineFactory', () => {
    const stateMachineFactory: StateMachineFactory = mock<StateMachineFactory>();
    ok(guard(stateMachineFactory), 'StateMachineFactory should return true');
  });
});

assertGuard(guard, 'createStateMachine');

assertContract(CONTRACT, 'StateMachineFactory');
