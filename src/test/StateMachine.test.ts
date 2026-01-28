import { mock } from "jest-mock-extended";
import { ok, strictEqual } from "node:assert";

import { Config, guard, StateMachine } from "@jonloucks/concurrency-ts/api/StateMachine";
import { Supplier } from "@jonloucks/concurrency-ts/auxiliary/Supplier";
import { Rule } from "@jonloucks/concurrency-ts/api/Rule";

import { assertGuard } from "./helper.test";

// temporary imports until Concurrency CONTRACT is available
import { create as createStateMachine } from "../impl/StateMachine.impl";
import { isPresent, OptionalType } from "@jonloucks/contracts-ts";
import { LargeNumberLike } from "node:crypto";

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
  'notifyWhile',
  'open'
);

describe('StateMachine Functional Tests', () => {
  const states: string[] = ['STATE1', 'STATE2', 'STATE3'];
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
  const stateMachine: StateMachine<string> = createStateMachine<string>(config);

  it('Initial state should be STATE1', () => {
    strictEqual(stateMachine.getState(), states[0], 'Initial state should be STATE1');
  });

  it('Transition from STATE1 to STATE2 should be allowed', () => {
    ok(stateMachine.isTransitionAllowed('EVENT1', 'STATE2'), 'Transition from STATE1 to STATE2 should be allowed');
  });

  it('Transition from STATE1 to STATE3 should not be allowed', () => {
    ok(!stateMachine.isTransitionAllowed('EVENT1', 'STATE3'), 'Transition from STATE1 to STATE3 should not be allowed');
  });

  it('Transition from STATE1 to STATE2 should succeed', () => {
    const result: OptionalType<number> = stateMachine.transition<number>({
      getEvent: function (): string {
        return "green";
      },
      getSuccessState: function (): string {
        return states[1];
      },
      getErrorState: function (): OptionalType<string> {
        return undefined;
      },
      getFailedState: function (): OptionalType<string> {
        return undefined;
      },
      getSuccessValue: function (): OptionalType<Supplier<number>> {
        return {
          supply: function (): number {
            return 42;
          }
        };
      },
      getErrorValue: function (): OptionalType<Supplier<number>> {
        return undefined;
      },
      getFailedValue: function (): OptionalType<Supplier<number>> {
        return undefined;
      }
    });
    strictEqual(stateMachine.getState(), states[1], `State should be ${states[1]} after transition`);
    ok(isPresent(result), 'Result should be present after successful transition');
    strictEqual(result!, 42, `Result should be the success value after successful transition`);
  });

  // it('Transition from STATE2 to STATE3 should succeed', () => {
  //   stateMachine.transition('EVENT2', 'STATE3');
  //   strictEqual(stateMachine.getState(), states[2], 'State should be STATE3 after transition');
  // });

  // it('Transition from STATE3 to STATE1 should fail', () => {
  //   throws(() => {
  //     stateMachine.transition('EVENT3', 'STATE1');
  //   }, {
  //     name: 'IllegalStateException',
  //     message: 'Transition from STATE3 to STATE1 is not allowed.'
  //   });
  // });
});