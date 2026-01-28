
import { Duration, OptionalType, RequiredType, guardFunctions } from "@jonloucks/concurrency-ts/api/Types";

import { Type as PredicateType } from "@jonloucks/concurrency-ts/auxiliary/Predicate";
import { Supplier } from "@jonloucks/concurrency-ts/auxiliary/Supplier";

export { RequiredType, OptionalType, Duration, PredicateType, Supplier }

/**
 * Waitable supplier
 * @param <T> the type of value supplied
 */
export interface WaitableSupplier<T> extends Supplier<T> {

  /**
   * @return Get current value
   */
  supply(): T;

  /**
   * Gets the current value if it satisfies a condition
   * 
   * In languages that support synchronization this method would lock before checking the predicate. In JavaScript/TypeScript this is not possible so
   * this method creates a one-time promise that evaluates the predicate against the current value.
   * If the predicate is satisfied the promise resolves with the current value.
   *
   * @param predicate the predicate
   * @return the current value if and only if the condition is satisfied
   * @throws IllegalArgumentException if predicate is null or if value is null
   */
  supplyIf(predicate: PredicateType<T>): OptionalType<T>;

  /**
   * Waits until the current value if it satisfies a condition or a timeout is reached
   * 
   * In languages that support synchronization this method would lock before checking the predicate. In JavaScript/TypeScript this is not possible so
   * this method creates a one-time promise that evaluates the predicate against the current value.
   * If the predicate is satisfied the promise resolves with the current value.
   * 
   * if the predicate is not satisfied the promise remains pending until either:
   * - another thread updates the value and the predicate is satisfied, or
   * - the optional timeout elapses
   * 
   * In languages that support synchronization this method would lock
   *
   * @param predicate the predicate to test if the value satisfies the stop waiting condition
   * @param timeout the time to wait for the value to satisfy the predicate
   * @return the current value if and only if the condition is satisfied
   * @throws IllegalArgumentException if predicate is null, duration is null, or duration is negative
   */
  supplyWhen(predicate: RequiredType<PredicateType<T>>, timeout?: Duration): Promise<OptionalType<T>>;
}

/**
 * Determine if the given instance is a WaitableSupplier
 *
 * @param instance the instance to check
 * @return true if the instance is a WaitableSupplier
 */
export function guard<T>(instance: unknown): instance is RequiredType<WaitableSupplier<T>> {
  return guardFunctions(instance,
    'supply',
    'supplyIf',
    'supplyWhen',
  );
}