import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { CompletionNotify, isCompletionNotify } from "@jonloucks/concurrency-ts/api/CompletionNotify";
import { assertDuck } from "./helper.test";

describe('CompletionNotify Tests', () => {
  it('isCompletionNotify should return true for CompletionNotify', () => {
    const completionNotify: CompletionNotify<number> = mock<CompletionNotify<number>>();
    ok(isCompletionNotify(completionNotify), 'CompletionNotify should return true');
  });
});

assertDuck(isCompletionNotify, 'notify');
