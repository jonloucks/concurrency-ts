import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { WaitableNotify, isWaitableNotify } from "@jonloucks/concurrency-ts/api/WaitableNotify";
import { assertDuck } from "./helper.test";

describe('WaitableNotify Tests', () => {
  it('isWaitableNotify should return true for WaitableNotify', () => {
    const waitableNotify: WaitableNotify<number> = mock<WaitableNotify<number>>();
    ok(isWaitableNotify(waitableNotify), 'WaitableNotify should return true');
  });
});

assertDuck(isWaitableNotify,
  'notifyIf'
);