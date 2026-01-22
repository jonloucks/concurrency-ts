import { Completable, Config } from "@jonloucks/concurrency-ts/api/Completable";
import { Contract, createContract, hasFunctions } from "@jonloucks/contracts-ts";

export { Completable, Config } from "@jonloucks/concurrency-ts/api/Completable";

/**
 * Responsibility: Creating a new Completable
 */
export interface CompletableFactory {

  /**
   * Create a new Completable
   *
   * @param config the completable configuration
   * @return the new Completable
   * @param <T> the type of completion value
   */
  createCompletable<T>(config: Config<T>): Completable<T>
}

/**
 * Determine if an instance implements CompletableFactory
 * 
 * @param instance the instance to check
 * @returns true if the instance implements CompletableFactory
 */
export function guard(instance: unknown): instance is CompletableFactory {
  return hasFunctions(instance, 'createCompletable');
}

/**
 * The CompletableFactory contract
 */
export const CONTRACT: Contract<CompletableFactory> = createContract({
  name: "CompletableFactory",
  test: guard
});