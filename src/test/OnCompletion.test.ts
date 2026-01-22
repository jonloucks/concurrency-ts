import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { OnCompletion, guard } from "@jonloucks/concurrency-ts/api/OnCompletion";
import { assertGuard } from "./helper.test";

describe('OnCompletion Tests', () => {
  it('isOnCompletion should return true for OnCompletion', () => {
    const onCompletion: OnCompletion<string> = mock<OnCompletion<string>>();
    ok(guard(onCompletion), 'OnCompletion should return true');
  });
});

assertGuard(guard, 'onCompletion');