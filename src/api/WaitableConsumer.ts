import {
  Consumer, Duration,
  guardFunctions,
  OptionalType, PredicateType,
  RequiredType,
  SupplierType
} from "@jonloucks/concurrency-ts/api/Types";

/**
 * Waitable consumer
 * @param <T> the type of value
 */
export interface WaitableConsumer<T> extends Consumer<T> {

  /**
   * Assign a new value
   *
   * @param value the new value
   * @throws IllegalArgumentException if value is null
   */
  consume(value: SupplierType<T>): void;

  /**
   * Consume a new value if conditions are satisfied
   * 
   * In languages that support synchronization this method would lock
   * before checking the predicate. In JavaScript/TypeScript this is not possible so
   * if becomes a variant of an 'if' check followed by a 'set' operation.
   *
   * @param predicate the predicate to test if a value should be replaced
   * @param value the new value
   * @return the supplied value if and only if the condition is satisfied
   * @throws IllegalArgumentException if predicate is null or if value is null
   */
  consumeIf(predicate: RequiredType<PredicateType<T>>, value: SupplierType<T>): OptionalType<T>;

  /**
   * Consume a new value when conditions are satisfied
   * 
   * Create a one-time promise that evaluates the predicate against the current value.
   * If the predicate is satisfied the value is replaced and the promise resolves with the previous value.
   * 
   * if the predicate is not satisfied the promise remains pending until either:
   * - another thread updates the value and the predicate is satisfied, or
   * - the optional timeout elapses
   * 
   * In languages that support synchronization this method would lock
   *
   * @param predicate the predicate to test if a value should be replaced
   * @param value the new value
   * @param timeout how long to wait for the predicate to be satisfied
   * @return the supplied value if and only if the condition is satisfied
   * @throws IllegalArgumentException if predicate is not defined
   */
  consumeWhen(predicate: RequiredType<PredicateType<T>>, value: SupplierType<T>, timeout?: Duration): Promise<OptionalType<T>>;
}

/**
 * Determine if the given instance is a WaitableConsumer
 *
 * @param instance the instance to check
 * @return true if the instance is a WaitableConsumer
 */
export function guard<T>(instance: unknown): instance is RequiredType<WaitableConsumer<T>> {
  return guardFunctions(instance,
    'consume',
    'consumeIf',
    'consumeWhen'
  );
}