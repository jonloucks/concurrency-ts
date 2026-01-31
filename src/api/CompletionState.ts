import { Rule } from "@jonloucks/concurrency-ts/api/Rule";
import { Config } from "@jonloucks/concurrency-ts/api/StateMachine";

export const STATES: string[] = ['PENDING', 'FAILED', 'CANCELLED', 'SUCCEEDED'] as const;

/**
 * The possible states of a Completion
 */
export type State = typeof STATES[number];

export { State as CompletionState };

export const START_STATE: State = 'PENDING';

// review if this should be exported
export function getStateRules(state: State): Array<Rule<State>> {
  switch (state) {
    case 'PENDING':
      return [
        {
          canTransition: (_: string, goal: State): boolean => {
            return goal === 'FAILED' || goal === 'CANCELLED' || goal === 'SUCCEEDED';
          }
        }
      ];
    case 'FAILED':
    case 'CANCELLED':
    case 'SUCCEEDED':
      return [
        {
          canTransition: (_: string, __: State): boolean => {
            return false;
          },
          isTerminal: true
        }
      ];
    default:
      return [];
  }
};

export function getStateMachineConfig(): Config<State> {
  return {
    initialValue: START_STATE,
    states: STATES,
    getStateRules: getStateRules
  };
}

export function isTerminalState(state: State): boolean {
  return state === 'FAILED' || state === 'CANCELLED' || state === 'SUCCEEDED';
}