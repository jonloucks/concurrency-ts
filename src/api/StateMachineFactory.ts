import { Contract, createContract} from "@jonloucks/contracts-ts";
import { RequiredType, guardFunctions } from "@jonloucks/concurrency-ts/api/Types";
import { Config, StateMachine } from "@jonloucks/concurrency-ts/api/StateMachine";

/**
 * Rule machine, containing a set of sets that can be transitioned to by events/actions
 */
export interface StateMachineFactory {
  /**
   * Create a new StateMachine by configuration
   *
   * @param config the configuration
   * @return the new StateMachine
   * @param <T> the type of each state
   * @throws IllegalArgumentException if config is null or configuration is invalid
   */
  createStateMachine<T>(config: Config<T>): RequiredType<StateMachine<T>>;

  /**
   * Create a new StateMachine
   *
   * @param initialState the initial state
   * @return the new StateMachine
   * @param <T> the type of each state
   * @throws IllegalArgumentException if initialState is null
   */
  createStateMachine<T>(initialState: T): RequiredType<StateMachine<T>>;
}

/**
 * Determine if the given instance is a StateMachineFactory
 *
 * @param instance the instance to check
 * @return true if the instance is a StateMachineFactory
 */
export function guard(instance: unknown): instance is RequiredType<StateMachineFactory> {
  return guardFunctions(instance, 'createStateMachine');
}

/**
 * Contract for StateMachineFactory
 */
export const CONTRACT: Contract<StateMachineFactory> = createContract({
  name: "StateMachineFactory",
  test: guard
});