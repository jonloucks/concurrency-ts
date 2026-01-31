import { ok } from "node:assert";

import { CompletionNotify, guard } from "@jonloucks/concurrency-ts/api/CompletionNotify";
import { assertGuard, mockDuck } from "./helper.test";

const FUNCTION_NAMES : (string|symbol)[] = [
  'notify'
];

describe('CompletionNotify Tests', () => {
  it('isCompletionNotify should return true for CompletionNotify', () => {
    const completionNotify: CompletionNotify<number> = mockDuck<CompletionNotify<number>>(...FUNCTION_NAMES);
    ok(guard(completionNotify), 'CompletionNotify should return true');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);
