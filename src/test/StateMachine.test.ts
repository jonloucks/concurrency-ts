import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { Config, guard, StateMachine } from "@jonloucks/concurrency-ts/api/StateMachine";
import { assertGuard } from "./helper.test";

describe('StateMachine Tests', () => {
  it('isStateMachine should return true for StateMachine', () => {
    const stateMachine: StateMachine<string> = mock<StateMachine<string>>();
    ok(guard(stateMachine), 'StateMachine should return true');
  });
});

describe('StateMachine Config Tests', () => {
  it('Config should exist', () => {
    const config: Config<string> = mock<Config<string>>();
    ok(config, 'Config instance should be created');
  });
});

assertGuard(guard,
  'isTransitionAllowed',
  'getState',
  'setState',
  'hasState',
  'transition',
  'supply',
  'supplyIf',
  'supplyWhen',
  'notifyWhile'
);