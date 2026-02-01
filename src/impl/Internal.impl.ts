import { ConcurrencyException } from "@jonloucks/concurrency-ts/api/ConcurrencyException";
import { TimeoutException } from "@jonloucks/concurrency-ts/api/TimeoutException";
import { Duration, isPresent, MAX_TIMEOUT, RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { CONTRACTS, Contracts } from "@jonloucks/contracts-ts";
import { illegalCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";

/**
 * Helper functions for internal implementations.
 */
export const Internal = {

  /**
   * Resolves the contracts to use from the provided configurations.
   * Returns the first config with present contracts, or CONTRACTS as default.
   * @param configs the configurations to resolve from (in priority order)
   * @return the resolved contracts
   */
  resolveContracts(...configs: Array<{ contracts?: Contracts }| undefined>): RequiredType<Contracts> {
    for (const config of configs) {
      if (isPresent(config) && isPresent(config?.contracts)) {
        return config.contracts;
      }
    }
    return CONTRACTS;
  },

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

  /** 
   * Wraps a promise with a timeout. If the promise does not settle within the specified duration,
   * it rejects with a TimeoutException.
   * 
   * @param promise the promise to wrap
   * @param timeout the timeout duration
   * @param errorMessage optional error message for the TimeoutException
   * @return a promise that rejects with TimeoutException if the original promise does not settle in time
   */
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