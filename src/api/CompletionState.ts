import { Rule } from "@jonloucks/concurrency-ts/api/Rule";
import { Config } from "@jonloucks/concurrency-ts/api/StateMachine";

/**
 * The possible states of a Completion
 */
export const STATES: string[] = ['PENDING', 'FAILED', 'CANCELLED', 'SUCCEEDED'] as const;

/**
 * The possible states of a Completion
 */
export type State = typeof STATES[number];

/** The CompletionState type
 */
export { State as CompletionState };

/** The starting state for a Completion
 */
export const START_STATE: State = 'PENDING';

/**
 * Get the state transition rules for a given Completion state
 *
 * @param state the state to get rules for
 * @return the array of rules for the given state
 */
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

/**
 * Get the default StateMachine configuration for a Completion
 *
 * @return the default StateMachine configuration
 */
export function getStateMachineConfig(): Config<State> {
  return {
    initialValue: START_STATE,
    states: STATES,
    getStateRules: getStateRules
  };
}

/**
 * Determine if a state is a terminal state
 *
 * @param state the state to check
 * @return true if terminal state
 */
export function isTerminalState(state: State): boolean {
  return state === 'FAILED' || state === 'CANCELLED' || state === 'SUCCEEDED';
}