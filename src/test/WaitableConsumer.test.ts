import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { WaitableConsumer, isWaitableConsumer } from "@jonloucks/concurrency-ts/api/WaitableConsumer";
import { assertDuck } from "./helper.test";

describe('WaitableConsumer Tests', () => {
  it('isWaitableConsumer should return true for WaitableConsumer', () => {
    const waitableConsumer: WaitableConsumer<number> = mock<WaitableConsumer<number>>();
    ok(isWaitableConsumer(waitableConsumer), 'WaitableConsumer should return true');
  });     
}); 

assertDuck(isWaitableConsumer,
    'accept',
    'acceptIf',
    'acceptWhen'
);