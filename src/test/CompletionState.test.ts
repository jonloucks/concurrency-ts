import { ok, strictEqual } from "node:assert";

import { CompletionState, START_STATE, STATES, getStateMachineConfig, getStateRules, isTerminalState } from "@jonloucks/concurrency-ts/api/CompletionState";
import { Rule } from "@jonloucks/concurrency-ts/api/Rule";
import { Config as StateMachineConfig } from "@jonloucks/concurrency-ts/api/StateMachine";
import { isPresent } from "@jonloucks/contracts-ts/api/Types";

describe('Idempotent Tests', () => {
  it('should have correct start state', () => {
    ok(START_STATE === 'PENDING', 'Start state should be PENDING');
  });

  it('should have correct states', () => {
    const expectedStates = ['PENDING', 'FAILED', 'CANCELLED', 'SUCCEEDED'];
    ok(JSON.stringify(STATES) === JSON.stringify(expectedStates), 'States should match expected states');
  });

  it('should contain PENDING state', () => {
    ok(STATES.includes('PENDING'), 'STATES should include PENDING');
  });

  it('should contain FAILED state', () => {
    ok(STATES.includes('FAILED'), 'STATES should include FAILED');
  });

  it('should contain CANCELLED state', () => {
    ok(STATES.includes('CANCELLED'), 'STATES should include CANCELLED');
  });

  it('should contain SUCCEEDED state', () => {
    ok(STATES.includes('SUCCEEDED'), 'STATES should include SUCCEEDED');
  });

  it('should return correct state rules', () => {
    const openingRules = getStateRules('PENDING');
    ok(openingRules[0].canTransition('', 'SUCCEEDED') === true, 'Should be able to transition from PENDING to SUCCEEDED');
    ok(openingRules[0].canTransition('', 'FAILED') === true, 'Should be able to transition from PENDING to FAILED');
    ok(openingRules[0].canTransition('', 'CANCELLED') === true, 'Should be able to transition from PENDING to CANCELLED');
  });

  it('should return default config', () => {
    const config: StateMachineConfig<CompletionState> = getStateMachineConfig();
    ok(isPresent(config.initialValue), 'Default initial value should be present');
    ok(isPresent(config.getStateRules), 'Default contracts should be present');
  });
});

describe('Idempotent PENDING State Rules', () => {
  let rules: Array<Rule<CompletionState>>;

  beforeEach(() => {
    rules = getStateRules('PENDING');
  });

  it('should have rules', () => {
    ok(rules.length > 0, 'PENDING state should have rules');
  });

  it('should allow transition to FAILED', () => {
    ok(rules[0].canTransition('event', 'FAILED'), 'Should allow transition from PENDING to FAILED');
  });

  it('should allow transition to CANCELLED', () => {
    ok(rules[0].canTransition('event', 'CANCELLED'), 'Should allow transition from PENDING to CANCELLED');
  });

  it('should allow transition to SUCCEEDED', () => {
    ok(rules[0].canTransition('event', 'SUCCEEDED'), 'Should allow transition from PENDING to SUCCEEDED');
  });
});

describe('Idempotent FAILED State Rules', () => {
  let rules: Array<Rule<CompletionState>>;

  beforeEach(() => {
    rules = getStateRules('FAILED');
  });

  it('should have rules', () => {
    ok(rules.length > 0, 'FAILED state should have rules');
  });

  it('should not allow transition to PENDING', () => {
    ok(!rules[0].canTransition('event', 'PENDING'), 'Should not allow transition from FAILED to PENDING');
  });

  it('should be terminal state', () => {
    ok(isPresent(rules[0].isTerminal), 'FAILED rule should have isTerminal function');
    ok(rules[0].isTerminal!, 'FAILED should be a terminal state');
  });

});

describe('Idempotent State Machine Config', () => {
  let config: StateMachineConfig<CompletionState>;

  beforeEach(() => {
    config = getStateMachineConfig();
  });

  it('should have PENDING as initial value', () => {
    strictEqual(config.initialValue, 'PENDING', 'Initial value should be PENDING');
  });

  it('should have correct states array', () => {
    const expectedStates = ['PENDING', 'FAILED', 'CANCELLED', 'SUCCEEDED'];
    ok(JSON.stringify(config.states) === JSON.stringify(expectedStates), 'Config states should match expected');
  });

  it('should have getStateRules function', () => {
    ok(isPresent(config.getStateRules), 'Config should have getStateRules function');
  });

  it('should return rules for PENDING', () => {
    if (config.getStateRules) {
      const rules = config.getStateRules('PENDING');
      ok(rules.length > 0, 'Should return rules for PENDING');
    }
  });

  it('should return rules for FAILED', () => {
    if (config.getStateRules) {
      const rules = config.getStateRules('FAILED');
      ok(rules.length > 0, 'Should return rules for FAILED');
    }
  });

  it('should return rules for CANCELLED', () => {
    if (config.getStateRules) {
      const rules = config.getStateRules('CANCELLED');
      ok(rules.length > 0, 'Should return rules for CANCELLED');
    }
  });

  it('should return rules for SUCCEEDED', () => {
    if (config.getStateRules) {
      const rules = config.getStateRules('SUCCEEDED');
      ok(rules.length > 0, 'Should return rules for SUCCEEDED');
    }
  });

});

describe('Idempotent Unknown State Rules', () => {
  it('should return empty array for unknown state', () => {
    const rules = getStateRules('UNKNOWN' as CompletionState);
    strictEqual(rules.length, 0, 'Should return empty array for unknown state');
  });
});

describe('isTerminalState Tests', () => {
  it('should return false for PENDING state', () => {
    ok(!isTerminalState('PENDING'), 'PENDING should not be a terminal state');
  });

  it('should return true for FAILED state', () => {
    ok(isTerminalState('FAILED'), 'FAILED should be a terminal state');
  });

  it('should return true for CANCELLED state', () => {
    ok(isTerminalState('CANCELLED'), 'CANCELLED should be a terminal state');
  });

  it('should return true for SUCCEEDED state', () => {
    ok(isTerminalState('SUCCEEDED'), 'SUCCEEDED should be a terminal state');
  });
});

describe('isTerminalState Edge Cases', () => {
  it('PENDING is not terminal', () => {
    const result = isTerminalState('PENDING');
    strictEqual(result, false, 'PENDING should not be terminal');
  });

  it('FAILED is terminal', () => {
    const result = isTerminalState('FAILED');
    strictEqual(result, true, 'FAILED should be terminal');
  });

  it('CANCELLED is terminal', () => {
    const result = isTerminalState('CANCELLED');
    strictEqual(result, true, 'CANCELLED should be terminal');
  });

  it('SUCCEEDED is terminal', () => {
    const result = isTerminalState('SUCCEEDED');
    strictEqual(result, true, 'SUCCEEDED should be terminal');
  });
});

describe('isTerminalState Terminal States Consistency', () => {
  it('all terminal states should be identified correctly', () => {
    const terminalStates = STATES.filter(state => isTerminalState(state));
    const expectedTerminalStates = ['FAILED', 'CANCELLED', 'SUCCEEDED'];
    strictEqual(JSON.stringify(terminalStates.sort()), JSON.stringify(expectedTerminalStates.sort()), 'Terminal states should match expected');
  });

  it('only non-terminal state is PENDING', () => {
    const nonTerminalStates = STATES.filter(state => !isTerminalState(state));
    strictEqual(JSON.stringify(nonTerminalStates), JSON.stringify(['PENDING']), 'Non-terminal states should only be PENDING');
  });

  it('terminal states count should be 3', () => {
    const terminalCount = STATES.filter(state => isTerminalState(state)).length;
    strictEqual(terminalCount, 3, 'Should have exactly 3 terminal states');
  });

  it('non-terminal states count should be 1', () => {
    const nonTerminalCount = STATES.filter(state => !isTerminalState(state)).length;
    strictEqual(nonTerminalCount, 1, 'Should have exactly 1 non-terminal state');
  });
});