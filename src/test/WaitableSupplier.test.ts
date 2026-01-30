import { ok } from "node:assert";

import { WaitableSupplier, guard } from "@jonloucks/concurrency-ts/api/WaitableSupplier";
import { assertGuard, mockDuck } from "./helper.test";

const FUNCTION_NAMES: (string | symbol)[] = [
  'supply',
  'supplyIf',
  'supplyWhen'
];

describe('WaitableSupplier Tests', () => {
  it('isWaitableSupplier should return true for WaitableSupplier', () => {
    const waitableSupplier: WaitableSupplier<number> = mockDuck<WaitableSupplier<number>>(...FUNCTION_NAMES);
    ok(guard(waitableSupplier), 'WaitableSupplier should return true');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);