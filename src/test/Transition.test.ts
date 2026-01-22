import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { Transition, guard } from "@jonloucks/concurrency-ts/api/Transition";
import { assertGuard } from "./helper.test";

describe('Transition Tests', () => {
  it('isTransition should return true for Transition', () => {
    const transition: Transition<string, number> = mock<Transition<string, number>>();
    ok(guard(transition), 'Transition should return true');
  });
});

assertGuard(guard,
  'getEvent',
  'getSuccessState',
  'getErrorState',
  'getFailedState',
  'getSuccessValue',
  'getErrorValue',
  'getFailedValue'
);