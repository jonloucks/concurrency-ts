import { mock, MockProxy } from "jest-mock-extended";
import { ok } from "node:assert";

import { Rule, guard } from "@jonloucks/concurrency-ts/api/Rule";
import { assertGuard, mockGuardFix } from "./helper.test";

const FUNCTION_NAMES : (string|symbol)[] = [
  'canTransition'
];

describe('Rule Tests', () => {
  it('isRule should return true for Rule', () => {
    const rule: MockProxy<Rule<string>> = mock<Rule<string>>();
    mockGuardFix(rule, ...FUNCTION_NAMES);
    ok(guard(rule), 'Rule should return true');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);