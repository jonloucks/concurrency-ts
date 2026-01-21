import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { WaitableFactory, isWaitableFactory, CONTRACT } from "@jonloucks/concurrency-ts/api/WaitableFactory";
import { assertContract, assertDuck } from "./helper.test";

describe('WaitableFactory Tests', () => {
  it('isWaitableFactory should return true for WaitableFactory', () => {
    const factory: WaitableFactory = mock<WaitableFactory>();
    ok(isWaitableFactory(factory), 'WaitableFactory should return true');
  });
});

assertDuck(isWaitableFactory,
  'create'
);

assertContract(CONTRACT, 'WaitableFactory');