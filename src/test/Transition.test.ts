import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { Transition, isTransition } from "@jonloucks/concurrency-ts/api/Transition";
import { assertDuck } from "./helper.test";

describe('Transition Tests', () => {
  it('isTransition should return true for Transition', () => {
    const transition: Transition<string, number> = mock<Transition<string, number>>();
    ok(isTransition(transition), 'Transition should return true');
  });
});

assertDuck(isTransition,
  'getEvent',
  'getSuccessState',
  'getErrorState',
  'getFailedState',
  'getSuccessValue',
  'getErrorValue',
  'getFailedValue'
);