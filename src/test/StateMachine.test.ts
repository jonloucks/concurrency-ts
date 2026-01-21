import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { StateMachine, Config, isStateMachine } from "@jonloucks/concurrency-ts/api/StateMachine";
import { assertDuck } from "./helper.test";

describe('StateMachine Tests', () => {
  it('isStateMachine should return true for StateMachine', () => {
    const stateMachine: StateMachine<string> = mock<StateMachine<string>>();
    ok(isStateMachine(stateMachine), 'StateMachine should return true');
  });
});

describe('StateMachine Config Tests', () => {
  it('Config should exist', () => {
    const config: Config<string> = mock<Config<string>>();
    ok(config, 'Config instance should be created');
  });
});

assertDuck(isStateMachine,
  'isTransitionAllowed',
  'getState',
  'setState',
  'hasState',
  'transition',
  'get',
  'getIf',
  'getWhen',
  'notifyIf'
);