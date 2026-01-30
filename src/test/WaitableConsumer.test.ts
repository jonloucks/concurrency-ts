import { mock, MockProxy } from "jest-mock-extended";
import { ok } from "node:assert";

import { WaitableConsumer, guard } from "@jonloucks/concurrency-ts/api/WaitableConsumer";
import { assertGuard, mockGuardFix } from "./helper.test";

const FUNCTION_NAMES: (string | symbol)[] = [
  'consume',
  'consumeIf',
  'consumeWhen'
];

describe('WaitableConsumer Tests', () => {
  it('isWaitableConsumer should return true for WaitableConsumer', () => {
    const waitableConsumer: MockProxy<WaitableConsumer<number>> = mock<WaitableConsumer<number>>();
    mockGuardFix(waitableConsumer, ...FUNCTION_NAMES);
    ok(guard(waitableConsumer), 'WaitableConsumer should return true');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);