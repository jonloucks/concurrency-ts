import { RequiredType, guardFunctions } from "@jonloucks/concurrency-ts/api/Types";

/**
 * An interface to determine if an action or activity is completed
 */
export interface IsCompleted {
  /**
   * Is the action or activity completed
   *
   * @return true if completed, false otherwise
   */
  isCompleted(): boolean;
}

/**
 * Determine if the given instance is an IsCompleted
 *
 * @param instance the instance to check
 * @return true if instance is an IsCompleted, false otherwise
 */
export function guard(instance: unknown): instance is RequiredType<IsCompleted> {
  return guardFunctions(instance, 'isCompleted');
}