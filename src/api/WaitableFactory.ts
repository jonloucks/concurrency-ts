import { Contract, createContract, hasFunctions, RequiredType } from "@jonloucks/contracts-ts";

import { Waitable } from "@jonloucks/concurrency-ts/api/Waitable";

/**
 * Waitable Factory
 */
export interface WaitableFactory {

  /**
   * Create a new Waitable with the given initial value
   *
   * @param initialValue (null is not allowed)
   * @return the waitable
   * @param <T> the type of waitable
   * @throws IllegalArgumentException if initialValue is null
   */
  create<T>(initialValue: T): RequiredType<Waitable<T>>;
}

/**
 * Determine if the given instance is a WaitableFactory
 *
 * @param instance the instance to check
 * @return true if the instance is a WaitableFactory
 */
export function guard(instance: unknown): instance is WaitableFactory {
  return hasFunctions(instance, 'create');
}

/**
 * Contract for WaitableFactory
 */
export const CONTRACT: Contract<WaitableFactory> = createContract({
  name: "WaitableFactory",
  test: guard
});