import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { CompletionFactory, isCompletionFactory, CONTRACT } from "@jonloucks/concurrency-ts/api/CompletionFactory";
import { assertContract, assertDuck } from "./helper.test";

describe('CompletionFactory Tests', () => {
  it('isCompletionFactory should return true for CompletionFactory', () => {
    const factory: CompletionFactory = mock<CompletionFactory>();
    ok(isCompletionFactory(factory), 'CompletionFactory should return true');
  });
});

assertDuck(isCompletionFactory, 'createCompletion');

assertContract(CONTRACT, 'CompletionFactory');

