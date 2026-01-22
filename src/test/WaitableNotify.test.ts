import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { WaitableNotify, guard } from "@jonloucks/concurrency-ts/api/WaitableNotify";
import { assertGuard } from "./helper.test";

describe('WaitableNotify Tests', () => {
  it('isWaitableNotify should return true for WaitableNotify', () => {
    const waitableNotify: WaitableNotify<number> = mock<WaitableNotify<number>>();
    ok(guard(waitableNotify), 'WaitableNotify should return true');
  });
});

assertGuard(guard,
  'notifyIf'
);