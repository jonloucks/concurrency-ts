import { ConcurrencyException } from "@jonloucks/concurrency-ts/api/ConcurrencyException";
import { TimeoutException } from "@jonloucks/concurrency-ts/api/TimeoutException";
import { Duration, MAX_TIMEOUT } from "@jonloucks/concurrency-ts/api/Types";
import { illegalCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";

/**
 * Helper functions for internal implementations.
 */
export const Internal = {

  /**
   * Throws an AggregateError with the provided message and list of errors.
   * If only one error is provided, it throws that error directly.
   * 
   * @param message the message for the AggregateError
   * @param errorList the list of errors to include
   */
  throwAggregateError(message: string, ...errorList: unknown[]): never {
    if (errorList.length === 1) {
      throw errorList[0];
    } else {
      const errorToString = (error: unknown): string => {
        if (error === null) {
          return "null";
        } else if (error === undefined) {
          return "undefined";
        } else if (error instanceof Error) {
          return error.message;
        } else if (typeof error === "string" || typeof error === "number" || typeof error === "boolean") {
          return String(error);
        } else {
          return JSON.stringify(error);
        }
      };
      // Map each error object to its message property
      const messages = errorList.map(error => `- ${errorToString(error)}`);

      // Join the messages with a newline separator
      const messagesJoined = messages.join('\n');

      throw new ConcurrencyException(message + "\n" + messagesJoined);
    }
  },

  async wrapPromiseWithTimeout<T>(promise: Promise<T>, timeout?: Duration, errorMessage?: string): Promise<T> {
    // Create a promise that rejects after the specified time
    const milliSeconds: number = timeout?.milliSeconds ?? MAX_TIMEOUT.milliSeconds;

    const validMilliSeconds = illegalCheck(milliSeconds, milliSeconds < 0, "Timeout duration must be non-negative.");

    if (validMilliSeconds === MAX_TIMEOUT.milliSeconds || validMilliSeconds === Infinity) {
      return promise;
    }   

    const timeoutPromise = new Promise<T>((_, reject) => {
      const delay = Math.max(10, validMilliSeconds);
      const timeoutId = setTimeout(() => {
        reject(new TimeoutException(errorMessage || `Promise timed out after ${validMilliSeconds} ms`));
      }, delay);

      // Clear the timeout if the original promise resolves or rejects first
      promise.finally(() => {
        clearTimeout(timeoutId);
      });
    });

    // Race the original promise against the timeout promise
    return Promise.race([promise, timeoutPromise]);
  }
}