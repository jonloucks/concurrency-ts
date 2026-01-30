import { ok } from "node:assert";

import { WaitableNotify, guard } from "@jonloucks/concurrency-ts/api/WaitableNotify";
import { assertGuard, mockDuck } from "./helper.test";

const FUNCTION_NAMES: (string | symbol)[] = [
  'notifyWhile'
];

describe('WaitableNotify Tests', () => {
  it('isWaitableNotify should return true for WaitableNotify', () => {
    const waitableNotify: WaitableNotify<number> = mockDuck<WaitableNotify<number>>(...FUNCTION_NAMES);
    ok(guard(waitableNotify), 'WaitableNotify should return true');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);