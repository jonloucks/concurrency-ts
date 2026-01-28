import { ConcurrencyException } from "@jonloucks/concurrency-ts/api/ConcurrencyException";

/**
 * Runtime exception thrown for Concurrency timeout related problems.
 */
export class TimeoutException extends ConcurrencyException {

  /**
   * Passthrough for {@link Error(String, Throwable)}
   *
   * @param message the message for this exception
   * @param thrown  the cause of this exception, null is allowed
   */
  public constructor(message: string, thrown: Error | null = null) {
    super(message, thrown);
    this.name = "TimeoutException";
    Object.setPrototypeOf(this, TimeoutException.prototype)
  }
}

/**
 * Determine if an instance is a TimeoutException
 *
 * @param instance the instance to check
 * @returns true if the instance is a TimeoutException
 */
export function guard(instance: unknown): instance is TimeoutException {
  return instance instanceof TimeoutException;
}

