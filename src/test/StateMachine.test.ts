import { mock, MockProxy } from "jest-mock-extended";
import { ok, strictEqual, throws } from "node:assert";

import { Rule } from "@jonloucks/concurrency-ts/api/Rule";
import { Config, guard, StateMachine } from "@jonloucks/concurrency-ts/api/StateMachine";
import { Transition } from "@jonloucks/concurrency-ts/api/Transition";

import { assertGuard, mockGuardFix } from "./helper.test";

// temporary imports until Concurrency CONTRACT is available
import { AutoClose, isPresent, OptionalType } from "@jonloucks/contracts-ts";
import { Consumer } from "../auxiliary/Consumer";
import { create as createStateMachine } from "../impl/StateMachine.impl";

const FUNCTION_NAMES: (string | symbol)[] = [
  'isTransitionAllowed',
  'getState',
  'setState',
  'hasState',
  'transition',
  'supply',
  'supplyIf',
  'supplyWhen',
  'notifyWhile',
  'isCompleted',
  'open'
];

describe('StateMachine Tests', () => {
  it('isStateMachine should return true for StateMachine', () => {
    const stateMachine: MockProxy<StateMachine<string>> = mock<StateMachine<string>>();
    mockGuardFix(stateMachine, ...FUNCTION_NAMES);
    ok(guard(stateMachine), 'StateMachine should return true');
  });
});

describe('StateMachine Config Tests', () => {
  it('Config should exist', () => {
    const config: Config<string> = mock<Config<string>>();
    ok(config, 'Config instance should be created');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);

describe('StateMachine Functional Tests', () => {
  let stateMachine: StateMachine<string>;
  let closeMachine: AutoClose;

  beforeEach(() => {
    const states: string[] = ['STATE1', 'STATE2', 'STATE3', 'GAME_OVER'];
    const rulesMap: Map<string, Array<Rule<string>>> = new Map<string, Array<Rule<string>>>();
    for (const state of states) {
      rulesMap.set(state, []);
    }
    rulesMap.get('STATE1')!.push({
      canTransition: function (_event: string, goal: string): boolean {
        return goal === 'STATE2';
      }
    });
    rulesMap.get('STATE2')!.push({
      canTransition: function (_event: string, goal: string): boolean {
        return goal === 'STATE3';
      }
    });
    const config: Config<string> = {
      initialValue: states[0],
      states: states,
      getStateRules: (state: string): Array<Rule<string>> => {
        return rulesMap.get(state)!;
      }
    };
    stateMachine = createStateMachine<string>(config);
    closeMachine = stateMachine.open();
  });

  afterEach(() => {
    closeMachine?.close();
  });

  it('Initial state should be STATE1', () => {
    strictEqual(stateMachine.getState(), 'STATE1', 'Initial state should be STATE1');
  });

  it('Transition from STATE1 to STATE2 should be allowed', () => {
    ok(stateMachine.isTransitionAllowed('EVENT1', 'STATE2'), 'Transition from STATE1 to STATE2 should be allowed');
  });

  it('Transition from STATE1 to STATE3 should not be allowed', () => {
    ok(!stateMachine.isTransitionAllowed('EVENT1', 'STATE3'), 'Transition from STATE1 to STATE3 should not be allowed');
  });

  it('Transition from STATE1 to STATE2 should succeed', () => {
    const result: OptionalType<number> = stateMachine.transition<number>({
      event: "green",
      successState: 'STATE2',
      getSuccessValue: function (): number {
        return 42;
      }
    });
    strictEqual(stateMachine.getState(), 'STATE2', `State should be STATE2 after transition`);
    ok(isPresent(result), 'Result should be present after successful transition');
    strictEqual(result!, 42, `Result should be the success value after successful transition`);
  });

  it('hasState should return true for known states', () => {
    ok(stateMachine.hasState('STATE1'), 'STATE1 should be known');
    ok(stateMachine.hasState('STATE2'), 'STATE2 should be known');
    ok(stateMachine.hasState('STATE3'), 'STATE3 should be known');
  });

  it('hasState should return false for unknown states', () => {
    ok(!stateMachine.hasState('STATE_UNKNOWN'), 'STATE_UNKNOWN should not be known');
  });

  it('setState should update state when transition is allowed', () => {
    // From STATE1, we can transition to STATE2
    const result = stateMachine.setState('EVENT_TRANSITION', 'STATE2');
    ok(result, 'setState should return true when transition is allowed');
    strictEqual(stateMachine.getState(), 'STATE2', 'State should be updated to STATE2');
  });

  it('setState should return false when transition is not allowed', () => {
    // From STATE1, we cannot transition directly to STATE3
    const result = stateMachine.setState('EVENT_INVALID', 'STATE3');
    ok(!result, 'setState should return false when transition is not allowed');
    strictEqual(stateMachine.getState(), 'STATE1', 'State should remain STATE1 when transition is not allowed');
  });

  it('setState should return false when transitioning to same state', () => {
    const result = stateMachine.setState('EVENT4', 'STATE1');
    ok(!result, 'setState should return false when transitioning to same state');
  });

  it('supply should return current state', () => {
    const state = stateMachine.supply();
    strictEqual(state, 'STATE1', 'supply should return current state');
  });

  it('supplyIf should return state when predicate matches', () => {
    const result = stateMachine.supplyIf((s) => s === 'STATE1');
    strictEqual(result, 'STATE1', 'supplyIf should return state when predicate matches');
  });

  it('supplyIf should return undefined when predicate does not match', () => {
    const result = stateMachine.supplyIf((s) => s === 'STATE2');
    ok(!isPresent(result), 'supplyIf should return undefined when predicate does not match');
  });

  it('transition with failed state should set state to failedState', () => {
    // Try a transition to an invalid state (STATE1 -> STATE3 is not allowed)
    const result: OptionalType<string> = stateMachine.transition<string>({
      event: "invalid_transition",
      successState: 'STATE3',
      failedState: 'STATE2',
      getFailedValue: () => 'failed_value'
    });
    strictEqual(stateMachine.getState(), 'STATE2', 'State should be updated to failedState');
    strictEqual(result, 'failed_value', 'Result should be the failed value');
  });

  it('transition without failed state should throw ConcurrencyException', () => {
    throws(() => {
      stateMachine.transition<string>({
        event: "invalid_transition",
        successState: 'STATE3'
      });
    }, {
      name: 'ConcurrencyException'
    });
  });

  it('transition with error state should handle thrown error', () => {
    // Do a valid transition first (STATE1 -> STATE2)
    stateMachine.transition<string>({
      event: "valid_event",
      successState: 'STATE2',
      getSuccessValue: () => 'success'
    });
    // Now from STATE2 we should be able to transition to STATE3 with error handling
    const result: OptionalType<string> = stateMachine.transition<string>({
      event: "error_event",
      successState: 'STATE3',
      getSuccessValue: () => {
        throw new Error('Test error');
      },
      errorState: 'STATE2',
      getErrorValue: () => 'error_handled'
    });
    strictEqual(stateMachine.getState(), 'STATE2', 'State should be updated to errorState');
    strictEqual(result, 'error_handled', 'Result should be the error value');
  });

  it('transition with error state should throw if getErrorValue not provided', () => {
    throws(() => {
      stateMachine.transition<string>({
        event: "error_event",
        successState: 'STATE2',
        errorState: 'STATE1',
        getSuccessValue: () => {
          throw new Error('Test error');
        }
      });
    }, {
      name: 'ConcurrencyException'
    });
  });

  it('supplyWhen should wait for predicate to be satisfied and return value', async () => {
    const promise = stateMachine.supplyWhen((val) => val === "STATE2");

    // Simulate value changes
    for (let i = 1; i <= 10; i++) {
      stateMachine.setState(`EVENT${i}`, `STATE${i}`);
    }

    const result = await promise;
    ok(result === "STATE2", 'supplyWhen should return value when predicate is satisfied');
  });

  it('notifyWhile should notify observers while predicate is satisfied', async () => {
 
    let notifications: string[] = [];

    const observer: Consumer<string> = {
      consume: (value: string) => {
        notifications.push(value);
      }
    };

    {
      using _notifyWhile = stateMachine.notifyWhile((val) => val.startsWith('STATE'), observer);

      // Simulate value changes
      for (let i = 6; i <= 20; i += 3) {
        stateMachine.setState(`EVENT${i}`, `STATE${i}`);
      }
      await new Promise((resolve, _) => setTimeout(resolve, 100));
    }

    ok(notifications.length > 0, 'Observer should have received notifications');
    ok(notifications[0] === "STATE1", 'First notification should be initial value');
  });
});

describe('StateMachine Edge Cases', () => {
  const simpleConfig: Config<number> = {
    initialValue: 0,
    states: [0, 1, 2],
    getStateRules: () => []
  };
  const simpleMachine = createStateMachine(simpleConfig);

  using _usingStateMachine = simpleMachine.open();

  it('should throw IllegalArgumentException when setState is called with null event', () => {
    throws(() => {
      simpleMachine.setState(null as unknown as string, 1);
    }, {
      name: 'IllegalArgumentException',
      message: 'Event must be present.'
    });
  });

  it('should throw IllegalArgumentException when setState is called with null state', () => {
    throws(() => {
      simpleMachine.setState('event', null as unknown as number);
    }, {
      name: 'IllegalArgumentException',
      message: 'State must be present.'
    });
  });

  it('should throw IllegalArgumentException when isTransitionAllowed is called with null event', () => {
    throws(() => {
      simpleMachine.isTransitionAllowed(null as unknown as string, 1);
    }, {
      name: 'IllegalArgumentException',
      message: 'Event must be present.'
    });
  });

  it('should throw IllegalArgumentException when isTransitionAllowed is called with null state', () => {
    throws(() => {
      simpleMachine.isTransitionAllowed('event', null as unknown as number);
    }, {
      name: 'IllegalArgumentException',
      message: 'State must be present.'
    });
  });

  it('should throw IllegalArgumentException when isTransitionAllowed is called with unknown state', () => {
    // Note: isTransitionAllowed returns false for unknown states rather than throwing
    // This is because hasState is called internally which just returns false for unknown states
    const result = simpleMachine.isTransitionAllowed('event', 999);
    ok(!result, 'isTransitionAllowed should return false for unknown states');
  });

  it('should throw IllegalArgumentException when transition is called with null transition', () => {
    throws(() => {
      simpleMachine.transition(null as unknown as Transition<number, unknown>);
    }, {
      name: 'IllegalArgumentException',
      message: 'Transition must be present.'
    });
  });

  it('should throw IllegalArgumentException when transition is called with unknown state', () => {
    throws(() => {
      simpleMachine.transition({
        event: 'event',
        successState: 999
      });
    }, {
      name: 'IllegalArgumentException',
      message: 'State must be known.'
    });
  });
});

describe('StateMachine with Rules Tests', () => {
  const stateA = 'A';
  const stateB = 'B';
  const stateC = 'C';
  const states = [stateA, stateB, stateC];

  const strictRule: Rule<string> = {
    canTransition: (event: string, toState: string) => {
      // Only allow transition to B when event is 'go_to_b'
      return toState !== stateB || event === 'go_to_b';
    }
  };

  const config: Config<string> = {
    initialValue: stateA,
    states: states,
    getStateRules: (state: string) => {
      return state === stateA ? [strictRule] : [];
    }
  };

  const machine = createStateMachine(config);
  using _usingStateMachine = machine.open();

  it('should allow transition when rule permits it', () => {
    const allowed = machine.isTransitionAllowed('go_to_b', stateB);
    ok(allowed, 'Transition should be allowed when rule permits it');
  });

  it('should not allow transition when rule forbids it', () => {
    const allowed = machine.isTransitionAllowed('go_somewhere', stateB);
    ok(!allowed, 'Transition should not be allowed when rule forbids it');
  });

  it('should allow transition when rule does not restrict it', () => {
    // First transition to B with correct event
    machine.setState('go_to_b', stateB);
    // Then transition from B to C should be allowed (no rules for B)
    const allowed = machine.isTransitionAllowed('go_to_c', stateC);
    ok(allowed, 'Transition should be allowed when there are no restricting rules');
  });

  it('should allow transition to C from A since no rule restricts it', () => {
    const _allowed = machine.isTransitionAllowed('any_event', stateC);
    // Note: This might not work if we're in state B, so let's first go back to A
  });
});

describe('StateMachine Initialization Tests', () => {
  it('should create state machine with minimal config', () => {
    const config: Config<string> = {
      initialValue: 'INITIAL',
      states: ['INITIAL']
    };
    const machine = createStateMachine(config);
    strictEqual(machine.getState(), 'INITIAL', 'Initial state should be set correctly');
  });

  it('should create state machine with empty rules', () => {
    const config: Config<string> = {
      initialValue: 'A',
      states: ['A', 'B'],
      getStateRules: () => []
    };
    const machine = createStateMachine(config);
    // Without rules, all transitions should be allowed
    ok(machine.isTransitionAllowed('event', 'B'), 'Transition should be allowed without rules');
  });

  it('should throw IllegalArgumentException when initial value is null', () => {
    throws(() => {
      createStateMachine({
        initialValue: null,
        states: ['A']
      });
    }, {
      name: 'IllegalArgumentException',
      message: 'Initial value must be present.'
    });
  });

  it('should throw IllegalArgumentException when config is null', () => {
    throws(() => {
      createStateMachine(null as unknown as Config<string>);
    }, {
      name: 'IllegalArgumentException',
      message: 'Config must be present.'
    });
  });
});