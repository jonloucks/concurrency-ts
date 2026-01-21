import { Supplier, OptionalType, RequiredType, Predicate, Duration } from "@jonloucks/concurrency-ts/api/Types";
import { hasFunctions } from "@jonloucks/contracts-ts";

/**
 * Waitable supplier
 * @param <T> the type of value supplied
 */
export interface WaitableSupplier<T> extends Supplier<T> {

  /**
   * @return Get current value
   */
  get(): T;

  /**
   * Gets the current value if it satisfies a condition
   *
   * @param predicate the predicate
   * @return the current value iif the condition is satisfied
   * @throws IllegalArgumentException if predicate is null or if value is null
   */
  getIf(predicate: Predicate<T>): OptionalType<T>;

  /**
   * Waits until the current value if it satisfies a condition or a timeout is reached
   *
   * @param predicate the predicate to test if the value satisfies the stop waiting condition
   * @param timeout the time to wait for the value to satisfy the predicate
   * @return the current value iif the condition is satisfied
   * @throws IllegalArgumentException if predicate is null, duration is null, or duration is negative
   */
  getWhen(predicate: RequiredType<Predicate<T>>, timeout?: OptionalType<Duration>): OptionalType<T>;
}

export function isWaitableSupplier<T>(instance: unknown): instance is WaitableSupplier<T> {
  return hasFunctions(instance,
    'get',
    'getIf',
    'getWhen'
  );
}