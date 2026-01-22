import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { WaitableSupplier, guard } from "@jonloucks/concurrency-ts/api/WaitableSupplier";
import { assertDuck } from "./helper.test";

describe('WaitableSupplier Tests', () => {
  it('isWaitableSupplier should return true for WaitableSupplier', () => {
    const waitableSupplier: WaitableSupplier<number> = mock<WaitableSupplier<number>>();
    ok(guard(waitableSupplier), 'WaitableSupplier should return true');
  });
});

assertDuck(guard,
  'get',
  'getIf',
  'getWhen'
);