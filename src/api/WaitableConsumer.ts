import { Consumer, Duration, OptionalType, PredicateType, RequiredType, Supplier } from "@jonloucks/concurrency-ts/api/Types";
import { hasFunctions } from "@jonloucks/contracts-ts";

/**
 * Waitable consumer
 * @param <T> the type of value
 */
export interface WaitableConsumer<T> extends Consumer<T> {
  /**
   * Assign a new value
   *
   * @param value the new value
   *  @throws IllegalArgumentException if value is null
   */

  accept(value: T): void;

  /**
   * Assign a new value if conditions are satisfied
   *
   * @param predicate the predicate to test if a value should be replaced
   * @param value the new value
   * @return if accepted the value replaced.
   * @throws IllegalArgumentException if predicate is null or if value is null
   */
  acceptIf(predicate: RequiredType<PredicateType<T>>, value: T): OptionalType<T>;

  /**
   * Assign a new value if conditions are satisfied
   *
   * @param predicate the predicate to test if a value should be replaced
   * @param valueSupplier the supplier of the new value
   * @return if accepted the value replaced.
   * @throws IllegalArgumentException if predicate is null or if value is null
   */
  acceptIf(predicate: RequiredType<PredicateType<T>>, valueSupplier: RequiredType<Supplier<T>>): OptionalType<T>;

  /**
   * Assign a new value if conditions are satisfied
   *
   * @param predicate the predicate to test if a value should be replaced
   * @param valueSupplier the new value supplier
   * @param timeout how long to wait to for test is satisfied
   * @return if accepted the value replaced.
   * @throws IllegalArgumentException if predicate is null, valueSupplier is null, timeout is null or invalid
   */
  acceptWhen(predicate: RequiredType<PredicateType<T>>, valueSupplier: RequiredType<Supplier<T>>, timeout?: OptionalType<Duration>): OptionalType<T>;
}

export function guard<T>(instance: unknown): instance is WaitableConsumer<T> {
  return hasFunctions(instance,
    'accept',
    'acceptIf',
    'acceptWhen'
  );
}