import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { WaitableConsumer, guard } from "@jonloucks/concurrency-ts/api/WaitableConsumer";
import { assertGuard } from "./helper.test";

describe('WaitableConsumer Tests', () => {
  it('isWaitableConsumer should return true for WaitableConsumer', () => {
    const waitableConsumer: WaitableConsumer<number> = mock<WaitableConsumer<number>>();
    ok(guard(waitableConsumer), 'WaitableConsumer should return true');
  });
});

assertGuard(guard,
  'accept',
  'acceptIf',
  'acceptWhen'
);