import { RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { Completion } from "@jonloucks/concurrency-ts/api/Completion";
import { hasFunctions } from "@jonloucks/contracts-ts";

/**
 * Responsibility: to receive the information when an action or activity has finished.
 * Use for both asynchronous and synchronous actions. The only difference is when and on what
 * thread the callback is executed on
 * @param <T> the type of completion value
 */
export interface OnCompletion<T> {

  /**
   * Callback which receives the
   * @param completion the completion information.
   */
  onCompletion(completion: RequiredType<Completion<T>>): void;
}

/**
 * Determine if the given instance is an OnCompletion
 *
 * @param instance the instance to check
 * @return true if instance is an OnCompletion, false otherwise
 */
export function isOnCompletion<T>(instance: unknown): instance is OnCompletion<T> {
  return hasFunctions(instance, 'onCompletion');
};