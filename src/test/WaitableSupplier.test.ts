import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { WaitableSupplier, isWaitableSupplier } from "@jonloucks/concurrency-ts/api/WaitableSupplier";
import { assertDuck } from "./helper.test";

describe('WaitableSupplier Tests', () => {
  it('isWaitableSupplier should return true for WaitableSupplier', () => {
    const waitableSupplier: WaitableSupplier<number> = mock<WaitableSupplier<number>>();
    ok(isWaitableSupplier(waitableSupplier), 'WaitableSupplier should return true');
  });
});

assertDuck(isWaitableSupplier,
  'get',
  'getIf',
  'getWhen'
);