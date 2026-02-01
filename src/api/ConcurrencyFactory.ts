import { Concurrency, Config as ConcurrencyConfig } from "@jonloucks/concurrency-ts/api/Concurrency";
import { Contract, createContract, Repository } from "@jonloucks/contracts-ts";
import { RequiredType, guardFunctions } from "@jonloucks/concurrency-ts/api/Types";

/**
 * Responsible for creating new instances of Concurrency
 */
export interface ConcurrencyFactory {

  /**
   * Create a new instance of Concurrency
   * <p>
   *     Note: caller is responsible for calling Open.open and calling
   *     the AutoClose.close when done with the instance.
   * </p>
   * @param config the Concurrency configuration for the new instance
   * @return the new Concurrency instance
   * @throws IllegalArgumentException if config is null or when configuration is invalid
   */
  createConcurrency(config?: ConcurrencyConfig): Concurrency;

  /**
   * Install all the requirements and promises to the given Contracts Repository.
   * Include Concurrency#CONTRACT which will provide a unique
   *
   * @param repository the repository to add requirements and promises to
   * @param config the Concurrency config
   * @throws IllegalArgumentException if config is null, config is invalid, or repository is null
   */
  install(repository: RequiredType<Repository>, config?: ConcurrencyConfig): void;
}

/**
 * Determine if the given instance is a ConcurrencyFactory
 *
 * @param instance the instance to check
 * @return true if instance is a ConcurrencyFactory, false otherwise
 */
export function guard(instance: unknown): instance is RequiredType<ConcurrencyFactory> {
  return guardFunctions(instance, 'createConcurrency', 'install');
}

/**
 * The Contract for ConcurrencyFactory
 */
export const CONTRACT: Contract<ConcurrencyFactory> = createContract({
  name: "ConcurrencyFactory",
  test: guard
});