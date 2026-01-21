import { hasFunctions, RequiredType, AutoClose } from "@jonloucks/contracts-ts";

import { Predicate, Consumer } from "@jonloucks/concurrency-ts/api/Types";

export { RequiredType, AutoClose } from "@jonloucks/contracts-ts";
export { Predicate, Consumer } from "@jonloucks/concurrency-ts/api/Types";

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
  notifyIf(predicate: RequiredType<Predicate<T>>, listener: RequiredType<Consumer<T>>): RequiredType<AutoClose>;
}

/**
 * Duck type guard check for WaitableNotify
 * 
 * @param value  the value to check
 * @param <T>    the type of value  
 * @returns true if value is WaitableNotify, false otherwise
 */
export function isWaitableNotify<T>(value: unknown): value is WaitableNotify<T> {
  return hasFunctions(value, 'notifyIf');
}