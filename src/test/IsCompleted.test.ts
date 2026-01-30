import { mock, MockProxy } from "jest-mock-extended";
import { ok } from "node:assert";

import { IsCompleted, guard } from "@jonloucks/concurrency-ts/api/IsCompleted";
import { assertGuard, mockGuardFix } from "./helper.test";

const FUNCTION_NAMES : (string|symbol)[] = [
  'isCompleted'
];

describe('IsCompleted Tests', () => {
  it('isIsCompleted should return true for IsCompleted', () => {
    const completable: MockProxy<IsCompleted> = mock<IsCompleted>();
    mockGuardFix(completable, ...FUNCTION_NAMES);
    ok(guard(completable), 'IsCompleted should return true');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);
