import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { Rule, guard } from "@jonloucks/concurrency-ts/api/Rule";
import { assertDuck } from "./helper.test";

describe('Rule Tests', () => {
  it('isRule should return true for Rule', () => {
    const rule: Rule<string> = mock<Rule<string>>();
    ok(guard(rule), 'Rule should return true');
  });
});

assertDuck(guard, 'canTransition');