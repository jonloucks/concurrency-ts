import { ConcurrencyException } from "../api/ConcurrencyException";

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
      // Map each error object to its message property
      const messages = errorList.map(error => `- ${error instanceof Error ? error.message : String(error)}`);

      // Join the messages with a newline separator
      const messagesJoined = messages.join('\n');

      throw new ConcurrencyException(message + "\n" + messagesJoined);
    }
  }
}