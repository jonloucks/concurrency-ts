import { ok } from "node:assert";

import { Rule, guard } from "@jonloucks/concurrency-ts/api/Rule";
import { assertGuard, mockDuck } from "./helper.test";

const FUNCTION_NAMES : (string|symbol)[] = [
  'canTransition'
];

describe('Rule Tests', () => {
  it('isRule should return true for Rule', () => {
    const rule: Rule<string> = mockDuck<Rule<string>>(...FUNCTION_NAMES);
    ok(guard(rule), 'Rule should return true');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);