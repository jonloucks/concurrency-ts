import { mock, MockProxy } from "jest-mock-extended";
import { ok } from "node:assert";

import { OnCompletion, guard } from "@jonloucks/concurrency-ts/api/OnCompletion";
import { assertGuard, mockGuardFix } from "./helper.test";

const FUNCTION_NAMES : (string|symbol)[] = [
  'onCompletion'
];

describe('OnCompletion Tests', () => {
  it('isOnCompletion should return true for OnCompletion', () => {
    const onCompletion: MockProxy<OnCompletion<string>> = mock<OnCompletion<string>>();
    mockGuardFix(onCompletion, ...FUNCTION_NAMES); 
    ok(guard(onCompletion), 'OnCompletion should return true');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);