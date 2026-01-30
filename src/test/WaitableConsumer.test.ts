import { ok } from "node:assert";

import { WaitableConsumer, guard } from "@jonloucks/concurrency-ts/api/WaitableConsumer";
import { assertGuard, mockDuck } from "./helper.test";

const FUNCTION_NAMES: (string | symbol)[] = [
  'consume',
  'consumeIf',
  'consumeWhen'
];

describe('WaitableConsumer Tests', () => {
  it('isWaitableConsumer should return true for WaitableConsumer', () => {
    const waitableConsumer: WaitableConsumer<number> = mockDuck<WaitableConsumer<number>>(...FUNCTION_NAMES);
    ok(guard(waitableConsumer), 'WaitableConsumer should return true');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);