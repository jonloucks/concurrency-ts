import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { Completion, Config, State, isCompletion } from "@jonloucks/concurrency-ts/api/Completion";
import { assertDuck } from "./helper.test";

describe('isCompletion Tests', () => {
  it('isCompletion should return true for Completion', () => {
    const completion: Completion<number> = mock<Completion<number>>();
    ok(isCompletion(completion), 'Completion should return true');
  });
});

assertDuck(isCompletion, 
  'getState', 
  'getThrown', 
  'getValue', 
  'getPromise',
  'isCompleted'
);

describe('State Type Tests', () => {
  it('State type should allow only valid states', () => {
    const pendingState: State = 'PENDING';
    const failedState: State = 'FAILED';
    const cancelledState: State = 'CANCELLED';
    const succeededState: State = 'SUCCEEDED';

    ok(pendingState === 'PENDING', 'pendingState should be PENDING');
    ok(failedState === 'FAILED', 'failedState should be FAILED');
    ok(cancelledState === 'CANCELLED', 'cancelledState should be CANCELLED');
    ok(succeededState === 'SUCCEEDED', 'succeededState should be SUCCEEDED');
  });
});

describe('Completion Exports', () => {
  it('should export Completion and Config', () => {
    const config: Config<number> = mock<Config<number>>();
    const completion: Completion<number> = mock<Completion<number>>();
    ok(config !== undefined, 'Config should be defined');
    ok(completion !== undefined, 'Completion should be defined');
  });
});   