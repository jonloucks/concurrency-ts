import { Contract, createContract, RequiredType } from "@jonloucks/contracts-ts";
import { guardFunctions } from "@jonloucks/concurrency-ts/api/Types";
import { Idempotent, Config } from "@jonloucks/concurrency-ts/api/Idempotent";

/**
 * Idempotent Factory
 */
export interface IdempotentFactory {

  /**
   * Create a new Idempotent with the given initial value
   *
   * @param config the configuration for the idempotent (null is not allowed)
   * @return the idempotent
   * @param <T> the type of idempotent
   * @throws IllegalArgumentException if initialValue is null
   */
  createIdempotent(config: Config): RequiredType<Idempotent>;
}

/**
 * Determine if the given instance is a IdempotentFactory
 *
 * @param instance the instance to check
 * @return true if the instance is a IdempotentFactory
 */
export function guard(instance: unknown): instance is RequiredType<IdempotentFactory> {
  return guardFunctions(instance, 'createIdempotent');
}

/**
 * Contract for IdempotentFactory
 */
export const CONTRACT: Contract<IdempotentFactory> = createContract({
  name: "IdempotentFactory",
  test: guard
});