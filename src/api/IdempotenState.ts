import { Rule } from "@jonloucks/concurrency-ts/api/Rule";
import { Config } from "@jonloucks/concurrency-ts/api/StateMachine";

export const STATES: string[] = ['OPENABLE', 'OPENING', 'OPENED', 'CLOSING', 'CLOSED', 'DESTROYED'] as const;

export type State = typeof STATES[number];

export {State as IdempotentState };

export const START_STATE: State = 'OPENABLE';

// review if this should be exported
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
          canTransition: (_: string, goal: State): boolean => {
            return goal === 'DESTROYED' || goal === 'OPENABLE';
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