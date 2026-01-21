import { isWaitableConsumer, WaitableConsumer } from "@jonloucks/concurrency-ts/api/WaitableConsumer";
import { isWaitableSupplier, WaitableSupplier } from "@jonloucks/concurrency-ts/api/WaitableSupplier";
import { isWaitableNotify, WaitableNotify } from "@jonloucks/concurrency-ts/api/WaitableNotify";
import { hasFunctions } from "@jonloucks/contracts-ts";

/**
 * Provides mutable reference that allows other threads to wait until
 * the value satisfies a given condition.
 *
 * @param <T> the type of references
 */
export interface Waitable<T> extends WaitableSupplier<T>, WaitableConsumer<T>, WaitableNotify<T> {

  /**
   * Aborts all waiting threads.
   * All subsequent wait related calls will return immediately.
   * Shutdown is permanent
   */
  shutdown(): void;
}

/**
 * Determine if the given instance is a Waitable
 *
 * @param instance the instance to check
 * @return true if the instance is a Waitable
 */
export function isWaitable<T>(instance: unknown): instance is Waitable<T> {
  return hasFunctions(instance, 'shutdown')
    && isWaitableSupplier<T>(instance)
    && isWaitableConsumer<T>(instance)
    && isWaitableNotify<T>(instance);
}