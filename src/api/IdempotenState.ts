import { Rule } from "@jonloucks/concurrency-ts/api/Rule";
import { Config } from "@jonloucks/concurrency-ts/api/StateMachine";

/**
 * The possible states of an Idempotent
 */
export const STATES: string[] = ['OPENABLE', 'OPENING', 'OPENED', 'CLOSING', 'CLOSED', 'DESTROYED'] as const;

/** The possible states of an Idempotent */
export type State = typeof STATES[number];


/** The IdempotentState type */
export {State as IdempotentState };

/** The starting state for an Idempotent */
export const START_STATE: State = 'OPENABLE';

/**
 * Get the state transition rules for a given Idempotent state
 *
 * @param state the state to get rules for
 * @return the array of rules for the given state
 */
export function getStateRules(state: State): Array<Rule<State>> {
  switch (state) {
    case 'OPENABLE':
      return [
        {
          canTransition: (_: string, goal: State): boolean => {
            return goal === 'OPENING' || goal === 'OPENED';
          }
        }
      ];
    case 'OPENING':
      return [
        {
          canTransition: (_: string, goal: State): boolean => {
            return goal === 'OPENED' || goal === 'OPENABLE';
          }
        }
      ];
    case 'OPENED':
      return [
        {
          canTransition: (_: string, goal: State): boolean => {
            return goal === 'CLOSING' || goal === 'CLOSED';
          }
        }
      ];
    case 'CLOSING':
      return [
        {
          canTransition: (_: string, goal: State): boolean => {
            return goal === 'CLOSED';
          }
        }
      ];
    case 'CLOSED':
      return [
        {
          canTransition: (_: string, goal: State): boolean => {
            return goal === 'DESTROYED' || goal === 'OPENABLE';
          }
        }
      ];
    case 'DESTROYED':
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
 * Get the default StateMachine configuration for an Idempotent
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