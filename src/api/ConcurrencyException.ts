import { messageCheck } from "@jonloucks/contracts-ts/auxiliary/Checks"
import { isNotPresent } from "@jonloucks/contracts-ts/api/Types";
import { used } from "../auxiliary/Checks";

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
  public constructor(message: string, thrown: Error | null = null) {
    // super(messageCheck(message), thrown || undefined);
    super(messageCheck(message));
    used(thrown);
    this.name = "ConcurrencyException";
    Object.setPrototypeOf(this, ConcurrencyException.prototype)
  }

  /**
   * Ensure something that was caught is rethrown as a ConcurrencyException
   * @param caught the caught value
   * @param message the optional message to use if caught is not an ConcurrencyException
   */
  static rethrow(caught: unknown, message?: string): never {
    if (isNotPresent(caught)) {
       this.throwUnknown(message);
    } else if (guard(caught)) {
      throw caught;
    } else if (caught instanceof Error) {
      throw new ConcurrencyException(message ?? caught.message, caught);
    } else {
       this.throwUnknown(message);
    }
  }

  private static throwUnknown( message?: string): never {
    throw new ConcurrencyException(message ?? "Unknown type of caught value.");
  }
}

/**
 * Determine if an instance is a ConcurrencyException
 *
 * @param instance the instance to check
 * @returns true if the instance is a ConcurrencyException
 */
export function guard(instance: unknown): instance is ConcurrencyException {
  return instance instanceof ConcurrencyException;
}

