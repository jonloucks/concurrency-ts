import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { IsCompleted, isIsCompleted } from "@jonloucks/concurrency-ts/api/IsCompleted";
import { assertDuck } from "./helper.test";

describe('IsCompleted Tests', () => {
  it('isIsCompleted should return true for IsCompleted', () => {
    const completable: IsCompleted = mock<IsCompleted>();
    ok(isIsCompleted(completable), 'IsCompleted should return true');
  });
});

assertDuck(isIsCompleted, 'isCompleted');
