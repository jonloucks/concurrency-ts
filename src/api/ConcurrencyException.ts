import { messageCheck } from "@jonloucks/contracts-ts/auxiliary/Checks"

/**
 * Runtime exception thrown for Concurrency related problems.
 */
export class ConcurrencyException extends Error {

  /**
   * Passthrough for {@link Error(String, Throwable)}
   *
   * @param message the message for this exception
   * @param thrown  the cause of this exception, null is allowed
   */
  public constructor(message: string, _thrown: Error | null = null) {
    // super(messageCheck(message), thrown || undefined);
    super(messageCheck(message));
    this.name = "ConcurrencyException";
    Object.setPrototypeOf(this, ConcurrencyException.prototype)
  }

  /**
   * Ensure something that was caught is rethrown as a ConcurrencyException
   * @param caught the caught value
   * @param message the optional message to use if caught is not an ConcurrencyException
   */
  static rethrow(caught: unknown, message?: string): never {
    if (caught instanceof ConcurrencyException) {
      throw caught;
    } else if (caught instanceof Error) {
      throw new ConcurrencyException(message ?? caught.message, caught);
    } else {
      throw new ConcurrencyException(message ?? "Unknown type of caught value.");
    }
  }
}

