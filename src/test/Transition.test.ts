import { ok } from "node:assert";

import { Transition, guard } from "@jonloucks/concurrency-ts/api/Transition";
import { assertGuard, mockDuck } from "./helper.test";


const FUNCTION_NAMES: (string | symbol)[] = [
  'event',
  'goalState',
  'errorState',
  'failedState',
  'getSuccessValue',
  'getErrorValue',
  'getFailedValue'
];

describe('Transition Tests', () => {
  it('isTransition should return true for Transition', () => {
    const transition: Transition<string, number> = mockDuck<Transition<string, number>>(...FUNCTION_NAMES);
    ok(guard(transition), 'Transition should return true');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);