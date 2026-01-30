import { ok, strictEqual } from "node:assert";

import { IdempotentState, START_STATE, STATES, getStateMachineConfig, getStateRules } from "@jonloucks/concurrency-ts/api/IdempotenState";
import { Rule } from "@jonloucks/concurrency-ts/api/Rule";
import { Config as StateMachineConfig } from "@jonloucks/concurrency-ts/api/StateMachine";
import { isPresent } from "@jonloucks/contracts-ts/api/Types";

describe('Idempotent Tests', () => {
  it('should have correct start state', () => {
    ok(START_STATE === 'OPENABLE', 'Start state should be OPENABLE');
  });

  it('should have correct states', () => {
    const expectedStates = ['OPENABLE', 'OPENING', 'OPENED', 'CLOSING', 'CLOSED', 'DESTROYED'];
    ok(JSON.stringify(STATES) === JSON.stringify(expectedStates), 'States should match expected states');
  });

  it('should contain OPENABLE state', () => {
    ok(STATES.includes('OPENABLE'), 'STATES should include OPENABLE');
  });

  it('should contain OPENING state', () => {
    ok(STATES.includes('OPENING'), 'STATES should include OPENING');
  });

  it('should contain OPENED state', () => {
    ok(STATES.includes('OPENED'), 'STATES should include OPENED');
  });

  it('should contain CLOSING state', () => {
    ok(STATES.includes('CLOSING'), 'STATES should include CLOSING');
  });

  it('should contain CLOSED state', () => {
    ok(STATES.includes('CLOSED'), 'STATES should include CLOSED');
  });

  it('should contain DESTROYED state', () => {
    ok(STATES.includes('DESTROYED'), 'STATES should include DESTROYED');
  });

  it('should return correct state rules', () => {
    const openingRules = getStateRules('OPENING');
    ok(openingRules.length === 1, 'OPENING should have one rule');
    ok(openingRules[0].canTransition('', 'OPENED') === true, 'Should be able to transition from OPENING to OPENED');
    ok(openingRules[0].canTransition('', 'OPENABLE') === true, 'Should be able to transition from OPENING to OPENABLE');
    ok(openingRules[0].canTransition('', 'CLOSED') === false, 'Should not be able to transition from OPENING to CLOSED');
  });

  it('should return default config', () => {
    const config: StateMachineConfig<IdempotentState> = getStateMachineConfig();
    ok(isPresent(config.initialValue), 'Default initial value should be present');
    ok(isPresent(config.getStateRules), 'Default contracts should be present');
  });
});

describe('Idempotent OPENABLE State Rules', () => {
  let rules: Array<Rule<IdempotentState>>;

  beforeEach(() => {
    rules = getStateRules('OPENABLE');
  });

  it('should allow transition to OPENING', () => {
    ok(rules[0].canTransition('event', 'OPENING'), 'Should allow transition from OPENABLE to OPENING');
  });

  it('should allow transition to OPENED', () => {
    ok(rules[0].canTransition('event', 'OPENED'), 'Should allow transition from OPENABLE to OPENED');
  });

  it('should not allow transition to CLOSING', () => {
    ok(!rules[0].canTransition('event', 'CLOSING'), 'Should not allow transition from OPENABLE to CLOSING');
  });

  it('should not allow transition to CLOSED', () => {
    ok(!rules[0].canTransition('event', 'CLOSED'), 'Should not allow transition from OPENABLE to CLOSED');
  });

  it('should not allow transition to DESTROYED', () => {
    ok(!rules[0].canTransition('event', 'DESTROYED'), 'Should not allow transition from OPENABLE to DESTROYED');
  });

  it('should not allow transition to OPENABLE', () => {
    ok(!rules[0].canTransition('event', 'OPENABLE'), 'Should not allow transition from OPENABLE to OPENABLE');
  });
});

describe('Idempotent OPENING State Rules', () => {
  let rules: Array<Rule<IdempotentState>>;

  beforeEach(() => {
    rules = getStateRules('OPENING');
  });

  it('should allow transition to OPENED', () => {
    ok(rules[0].canTransition('event', 'OPENED'), 'Should allow transition from OPENING to OPENED');
  });

  it('should allow transition to OPENABLE', () => {
    ok(rules[0].canTransition('event', 'OPENABLE'), 'Should allow transition from OPENING to OPENABLE');
  });

  it('should not allow transition to OPENING', () => {
    ok(!rules[0].canTransition('event', 'OPENING'), 'Should not allow transition from OPENING to OPENING');
  });

  it('should not allow transition to CLOSING', () => {
    ok(!rules[0].canTransition('event', 'CLOSING'), 'Should not allow transition from OPENING to CLOSING');
  });

  it('should not allow transition to CLOSED', () => {
    ok(!rules[0].canTransition('event', 'CLOSED'), 'Should not allow transition from OPENING to CLOSED');
  });

  it('should not allow transition to DESTROYED', () => {
    ok(!rules[0].canTransition('event', 'DESTROYED'), 'Should not allow transition from OPENING to DESTROYED');
  });
});

describe('Idempotent OPENED State Rules', () => {
  let rules: Array<Rule<IdempotentState>>;

  beforeEach(() => {
    rules = getStateRules('OPENED');
  });

  it('should allow transition to CLOSING', () => {
    ok(rules[0].canTransition('event', 'CLOSING'), 'Should allow transition from OPENED to CLOSING');
  });

  it('should allow transition to CLOSED', () => {
    ok(rules[0].canTransition('event', 'CLOSED'), 'Should allow transition from OPENED to CLOSED');
  });

  it('should not allow transition to OPENABLE', () => {
    ok(!rules[0].canTransition('event', 'OPENABLE'), 'Should not allow transition from OPENED to OPENABLE');
  });

  it('should not allow transition to OPENING', () => {
    ok(!rules[0].canTransition('event', 'OPENING'), 'Should not allow transition from OPENED to OPENING');
  });

  it('should not allow transition to OPENED', () => {
    ok(!rules[0].canTransition('event', 'OPENED'), 'Should not allow transition from OPENED to OPENED');
  });

  it('should not allow transition to DESTROYED', () => {
    ok(!rules[0].canTransition('event', 'DESTROYED'), 'Should not allow transition from OPENED to DESTROYED');
  });
});

describe('Idempotent CLOSING State Rules', () => {
  let rules: Array<Rule<IdempotentState>>;

  beforeEach(() => {
    rules = getStateRules('CLOSING');
  });

  it('should allow transition to CLOSED', () => {
    ok(rules[0].canTransition('event', 'CLOSED'), 'Should allow transition from CLOSING to CLOSED');
  });

  it('should not allow transition to OPENABLE', () => {
    ok(!rules[0].canTransition('event', 'OPENABLE'), 'Should not allow transition from CLOSING to OPENABLE');
  });

  it('should not allow transition to OPENING', () => {
    ok(!rules[0].canTransition('event', 'OPENING'), 'Should not allow transition from CLOSING to OPENING');
  });

  it('should not allow transition to OPENED', () => {
    ok(!rules[0].canTransition('event', 'OPENED'), 'Should not allow transition from CLOSING to OPENED');
  });

  it('should not allow transition to CLOSING', () => {
    ok(!rules[0].canTransition('event', 'CLOSING'), 'Should not allow transition from CLOSING to CLOSING');
  });

  it('should not allow transition to DESTROYED', () => {
    ok(!rules[0].canTransition('event', 'DESTROYED'), 'Should not allow transition from CLOSING to DESTROYED');
  });
});

describe('Idempotent CLOSED State Rules', () => {
  let rules: Array<Rule<IdempotentState>>;

  beforeEach(() => {
    rules = getStateRules('CLOSED');
  });

  it('should allow transition to DESTROYED', () => {
    ok(rules[0].canTransition('event', 'DESTROYED'), 'Should allow transition from CLOSED to DESTROYED');
  });

  it('should allow transition to OPENABLE', () => {
    ok(rules[0].canTransition('event', 'OPENABLE'), 'Should allow transition from CLOSED to OPENABLE');
  });

  it('should not allow transition to OPENING', () => {
    ok(!rules[0].canTransition('event', 'OPENING'), 'Should not allow transition from CLOSED to OPENING');
  });

  it('should not allow transition to OPENED', () => {
    ok(!rules[0].canTransition('event', 'OPENED'), 'Should not allow transition from CLOSED to OPENED');
  });

  it('should not allow transition to CLOSING', () => {
    ok(!rules[0].canTransition('event', 'CLOSING'), 'Should not allow transition from CLOSED to CLOSING');
  });

  it('should not allow transition to CLOSED', () => {
    ok(!rules[0].canTransition('event', 'CLOSED'), 'Should not allow transition from CLOSED to CLOSED');
  });
});

describe('Idempotent DESTROYED State Rules', () => {
  let rules: Array<Rule<IdempotentState>>;

  beforeEach(() => {
    rules = getStateRules('DESTROYED');
  });

  it('should allow transition to DESTROYED', () => {
    ok(rules[0].canTransition('event', 'DESTROYED'), 'Should allow transition from DESTROYED to DESTROYED');
  });

  it('should allow transition to OPENABLE', () => {
    ok(rules[0].canTransition('event', 'OPENABLE'), 'Should allow transition from DESTROYED to OPENABLE');
  });

  it('should not allow transition to OPENING', () => {
    ok(!rules[0].canTransition('event', 'OPENING'), 'Should not allow transition from DESTROYED to OPENING');
  });

  it('should not allow transition to OPENED', () => {
    ok(!rules[0].canTransition('event', 'OPENED'), 'Should not allow transition from DESTROYED to OPENED');
  });

  it('should not allow transition to CLOSING', () => {
    ok(!rules[0].canTransition('event', 'CLOSING'), 'Should not allow transition from DESTROYED to CLOSING');
  });

  it('should not allow transition to CLOSED', () => {
    ok(!rules[0].canTransition('event', 'CLOSED'), 'Should not allow transition from DESTROYED to CLOSED');
  });

  it('should have isTerminal function', () => {
    ok(isPresent(rules[0].isTerminal), 'DESTROYED rule should have isTerminal function');
  });

  it('should be terminal state', () => {
    ok(rules[0].isTerminal!, 'DESTROYED should be a terminal state');
  });
});

describe('Idempotent State Machine Config', () => {
  let config: StateMachineConfig<IdempotentState>;

  beforeEach(() => {
    config = getStateMachineConfig();
  });

  it('should have OPENABLE as initial value', () => {
    strictEqual(config.initialValue, 'OPENABLE', 'Initial value should be OPENABLE');
  });

  it('should have all 6 states', () => {
    strictEqual(config.states.length, 6, 'Config should have 6 states');
  });

  it('should have correct states array', () => {
    const expectedStates = ['OPENABLE', 'OPENING', 'OPENED', 'CLOSING', 'CLOSED', 'DESTROYED'];
    ok(JSON.stringify(config.states) === JSON.stringify(expectedStates), 'Config states should match expected');
  });

  it('should have getStateRules function', () => {
    ok(isPresent(config.getStateRules), 'Config should have getStateRules function');
  });

  it('should return rules for OPENABLE', () => {
    if (config.getStateRules) {
      const rules = config.getStateRules('OPENABLE');
      ok(rules.length > 0, 'Should return rules for OPENABLE');
    }
  });

  it('should return rules for OPENING', () => {
    if (config.getStateRules) {
      const rules = config.getStateRules('OPENING');
      ok(rules.length > 0, 'Should return rules for OPENING');
    }
  });

  it('should return rules for OPENED', () => {
    if (config.getStateRules) {
      const rules = config.getStateRules('OPENED');
      ok(rules.length > 0, 'Should return rules for OPENED');
    }
  });

  it('should return rules for CLOSING', () => {
    if (config.getStateRules) {
      const rules = config.getStateRules('CLOSING');
      ok(rules.length > 0, 'Should return rules for CLOSING');
    }
  });

  it('should return rules for CLOSED', () => {
    if (config.getStateRules) {
      const rules = config.getStateRules('CLOSED');
      ok(rules.length > 0, 'Should return rules for CLOSED');
    }
  });

  it('should return rules for DESTROYED', () => {
    if (config.getStateRules) {
      const rules = config.getStateRules('DESTROYED');
      ok(rules.length > 0, 'Should return rules for DESTROYED');
    }
  });
});

describe('Idempotent Unknown State Rules', () => {
  it('should return empty array for unknown state', () => {
    const rules = getStateRules('UNKNOWN' as IdempotentState);
    strictEqual(rules.length, 0, 'Should return empty array for unknown state');
  });
});