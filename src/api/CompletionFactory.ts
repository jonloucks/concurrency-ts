import { Completion, Config as CompletionConfig } from "@jonloucks/concurrency-ts/api/Completion";
import { Contract, createContract, hasFunctions, RequiredType } from "@jonloucks/contracts-ts";

/**
 * Responsibility: Creating a new Completion
 */
export interface CompletionFactory {

  /**
   * Create a new Completion
   *
   * @param config the Completion configuration
   * @return the new Completion
   * @param <T> the type of completion value
   */
  createCompletion<T>(config: CompletionConfig<T>): RequiredType<Completion<T>>;
}

/**
 * Determine if an instance implements CompletionFactory
 * 
 * @param instance the instance to check
 * @returns true if the instance implements CompletionFactory
 */
export function guard(instance: unknown): instance is CompletionFactory {
  return hasFunctions(instance, 'createCompletion');
}

/**
 * The CompletionFactory contract
 */
export const CONTRACT: Contract<CompletionFactory> = createContract({
  name: "CompletionFactory",
  test: guard
});