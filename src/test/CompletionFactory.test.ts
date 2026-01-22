import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { CompletionFactory, CONTRACT, guard } from "@jonloucks/concurrency-ts/api/CompletionFactory";
import { assertContract, assertGuard } from "./helper.test";

describe('CompletionFactory Tests', () => {
  it('isCompletionFactory should return true for CompletionFactory', () => {
    const factory: CompletionFactory = mock<CompletionFactory>();
    ok(guard(factory), 'CompletionFactory should return true');
  });
});

assertGuard(guard, 'createCompletion');

assertContract(CONTRACT, 'CompletionFactory');

