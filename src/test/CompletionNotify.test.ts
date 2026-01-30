import { mock, MockProxy } from "jest-mock-extended";
import { ok } from "node:assert";

import { CompletionNotify, guard } from "@jonloucks/concurrency-ts/api/CompletionNotify";
import { assertGuard, mockGuardFix } from "./helper.test";

const FUNCTION_NAMES : (string|symbol)[] = [
  'notify'
];

describe('CompletionNotify Tests', () => {
  it('isCompletionNotify should return true for CompletionNotify', () => {
    const completionNotify: MockProxy<CompletionNotify<number>> = mock<CompletionNotify<number>>();
    mockGuardFix(completionNotify, ...FUNCTION_NAMES);
    ok(guard(completionNotify), 'CompletionNotify should return true');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);
