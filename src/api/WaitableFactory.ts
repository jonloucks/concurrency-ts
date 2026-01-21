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

export function isWaitableFactory(instance: unknown): instance is WaitableFactory {
  return hasFunctions(instance, 'create');
}

export const CONTRACT: Contract<WaitableFactory> = createContract({
  name: "WaitableFactory",
  test: isWaitableFactory
});