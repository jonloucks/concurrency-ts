import { RequiredType, guardFunctions } from "@jonloucks/concurrency-ts/api/Types";

/**
* Opt-in interface a state type can implement to assist in determining the valid transitions
*/
export interface Rule<T> {

  /**
   * Determine if 'this' state can transition to the target
   *
   * @param event the event name
   * @param goal  the goal state
   * @return true if the transition is valid
   */
  canTransition(event: string, goal: T): boolean;

  /**
   * Determine if the given state is a terminal state
   *
   * @return true if the state is terminal
   */
  isTerminal?: boolean;
}

/**
 * Type guard to determine if an instance implements Rule
 *
 * @param instance the instance to check
 * @return true if instance is a Rule
 */
export function guard<T>(instance: unknown): instance is RequiredType<Rule<T>> {
  return guardFunctions(instance, 'canTransition');
} 