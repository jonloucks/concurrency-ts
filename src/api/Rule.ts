import { hasFunctions } from "@jonloucks/contracts-ts";

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
}

/**
 * Type guard to determine if an instance implements Rule
 *
 * @param instance the instance to check
 * @return true if instance is a Rule
 */
export function isRule<T>(instance: unknown): instance is Rule<T> {
  return hasFunctions(instance, 'canTransition');
} 