import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { Completable, guard } from "@jonloucks/concurrency-ts/api/Completable";
import { assertDuck } from "./helper.test";

describe('Completable Tests', () => {
  it('isCompletable should return true for Completable', () => {
    const completable: Completable<number> = mock<Completable<number>>();
    ok(guard(completable), 'Completable should return true');
  });
});

assertDuck(guard,
  'open',
  'notifyState',
  'notifyValue',
  'getCompletion',
  'isCompleted',
  'onCompletion',
  'notify'
);
