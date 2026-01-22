import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { CONTRACT, WaitableFactory, guard } from "@jonloucks/concurrency-ts/api/WaitableFactory";
import { assertContract, assertGuard } from "./helper.test";

describe('WaitableFactory Tests', () => {
  it('isWaitableFactory should return true for WaitableFactory', () => {
    const factory: WaitableFactory = mock<WaitableFactory>();
    ok(guard(factory), 'WaitableFactory should return true');
  });
});

assertGuard(guard,
  'createWaitable'
);

assertContract(CONTRACT, 'WaitableFactory');