import { AutoClose, RequiredType } from "@jonloucks/contracts-ts";
import { guardFunctions } from "@jonloucks/concurrency-ts/api/Types";
import { Type as ConsumerType } from "@jonloucks/concurrency-ts/auxiliary/Consumer";
import { Type as PredicateType } from "@jonloucks/concurrency-ts/auxiliary/Predicate";

export { AutoClose, ConsumerType, PredicateType, RequiredType };

/**
 * Notify lister when condition is satisfied
 * @param <T> the type of value
 */
export interface WaitableNotify<T> {

  /**
   * When condition is satisfied the listener is invoked
   * Note: It is likely the listener will be called within a write lock context.
   * Deadlocks could happen of listener is waiting on another thread to acquire a lock to this WaitableNotify
   *
   * @param predicate the predicate to test if the value should be passed to listener
   * @param listener the listener
   * @return AutoClose which removes the listener
   * @throws IllegalArgumentException if predicate is null or the listener is null
 */
  notifyWhile(predicate: RequiredType<PredicateType<T>>, listener: RequiredType<ConsumerType<T>>): RequiredType<AutoClose>;
}

/**
 * Duck type guard check for WaitableNotify
 * 
 * @param value  the value to check
 * @param <T>    the type of value  
 * @returns true if value is WaitableNotify, false otherwise
 */
export function guard<T>(value: unknown): value is RequiredType<WaitableNotify<T>> {
  return guardFunctions(value, 'notifyWhile');
}