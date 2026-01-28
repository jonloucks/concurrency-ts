import { WaitableConsumer, guard as guardWaitableConsumer } from "@jonloucks/concurrency-ts/api/WaitableConsumer";
import { WaitableNotify, guard as guardWaitableNotify } from "@jonloucks/concurrency-ts/api/WaitableNotify";
import { WaitableSupplier, guard as guardWaitableSupplier } from "@jonloucks/concurrency-ts/api/WaitableSupplier";
import { RequiredType, guardFunctions } from "@jonloucks/concurrency-ts/api/Types";
import { Open } from "@jonloucks/contracts-ts/api/Open";

/**
 * Configuration for creating a Waitable
 */
export interface Config<T> {
  /**
   * Initial value of the Waitable
   */
  initialValue?: T;
}

/**
 * Provides mutable reference that allows other threads to wait until
 * the value satisfies a given condition.
 *
 * @param <T> the type of references
 */
export interface Waitable<T> extends Open, WaitableSupplier<T>, WaitableConsumer<T>, WaitableNotify<T> {
}

/**
 * Determine if the given instance is a Waitable
 *
 * @param instance the instance to check
 * @return true if the instance is a Waitable
 */
export function guard<T>(instance: unknown): instance is RequiredType<Waitable<T>> {
  return guardFunctions(instance, 'open')
    && guardWaitableConsumer<T>(instance)
    && guardWaitableNotify<T>(instance)
    && guardWaitableSupplier<T>(instance);
}