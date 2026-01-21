import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { Rule, isRule } from "@jonloucks/concurrency-ts/api/Rule";
import { assertDuck } from "./helper.test";

describe('Rule Tests', () => {
  it('isRule should return true for Rule', () => {
    const rule: Rule<string> = mock<Rule<string>>();
    ok(isRule(rule), 'Rule should return true');
  });
});

assertDuck(isRule, 'canTransition');