import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { IsCompleted, guard } from "@jonloucks/concurrency-ts/api/IsCompleted";
import { assertGuard } from "./helper.test";

describe('IsCompleted Tests', () => {
  it('isIsCompleted should return true for IsCompleted', () => {
    const completable: IsCompleted = mock<IsCompleted>();
    ok(guard(completable), 'IsCompleted should return true');
  });
});

assertGuard(guard, 'isCompleted');
