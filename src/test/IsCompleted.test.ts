import { ok } from "node:assert";

import { IsCompleted, guard } from "@jonloucks/concurrency-ts/api/IsCompleted";
import { assertGuard, mockDuck } from "./helper.test";

const FUNCTION_NAMES : (string|symbol)[] = [
  'isCompleted'
];

describe('IsCompleted Tests', () => {
  it('isIsCompleted should return true for IsCompleted', () => {
    const completable: IsCompleted = mockDuck<IsCompleted>(...FUNCTION_NAMES);
    ok(guard(completable), 'IsCompleted should return true');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);
