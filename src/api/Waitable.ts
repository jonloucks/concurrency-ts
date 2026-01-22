import { WaitableConsumer, guard as guardWaitableConsumer } from "@jonloucks/concurrency-ts/api/WaitableConsumer";
import { WaitableNotify, guard as guardWaitableNotify } from "@jonloucks/concurrency-ts/api/WaitableNotify";
import { WaitableSupplier, guard as guardWaitableSupplier } from "@jonloucks/concurrency-ts/api/WaitableSupplier";
import { RequiredType, guardFunctions } from "@jonloucks/concurrency-ts/api/Types";

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
export function guard<T>(instance: unknown): instance is RequiredType<Waitable<T>> {
  return guardFunctions(instance, 'shutdown')
    && guardWaitableConsumer<T>(instance)
    && guardWaitableNotify<T>(instance)
    && guardWaitableSupplier<T>(instance);
}