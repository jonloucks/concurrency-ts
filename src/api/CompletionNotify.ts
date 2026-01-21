import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { OnCompletion } from "@jonloucks/concurrency-ts/api/OnCompletion";
import { hasFunctions } from "@jonloucks/contracts-ts";

/**
 * Responsibility: Dispatch Completion status to subscribers
 */
export interface CompletionNotify<T> {

  /**
   * Open a notification subscription for receive completions
   *
   * @param onCompletion the completion
   * @return the
   */
  notify(onCompletion: OnCompletion<T>): AutoClose;
}

/**
 * Determine if an instance implements CompletionNotify
 * 
 * @param instance the instance to check
 * @returns true if the instance implements CompletionNotify
 */
export function isCompletionNotify<T>(instance: unknown): instance is CompletionNotify<T> {
  return hasFunctions(instance,
    'notify'
  );
}