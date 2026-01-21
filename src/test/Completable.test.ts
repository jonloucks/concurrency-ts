import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { Completable, isCompletable } from "@jonloucks/concurrency-ts/api/Completable";
import { assertDuck } from "./helper.test";

describe('Completable Tests', () => {
  it('isCompletable should return true for Completable', () => {
    const completable: Completable<number> = mock<Completable<number>>();
    ok(isCompletable(completable), 'Completable should return true');
  });
});

assertDuck(isCompletable,
  'open',
  'notifyState',
  'notifyValue',
  'getCompletion',
  'isCompleted',
  'onCompletion',
  'notify'
);
