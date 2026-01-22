import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { CompletionNotify, guard } from "@jonloucks/concurrency-ts/api/CompletionNotify";
import { assertGuard } from "./helper.test";

describe('CompletionNotify Tests', () => {
  it('isCompletionNotify should return true for CompletionNotify', () => {
    const completionNotify: CompletionNotify<number> = mock<CompletionNotify<number>>();
    ok(guard(completionNotify), 'CompletionNotify should return true');
  });
});

assertGuard(guard, 'notify');
