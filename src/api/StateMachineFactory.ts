import { Contract, createContract, hasFunctions, RequiredType} from "@jonloucks/contracts-ts";

import { StateMachine, Config } from "@jonloucks/concurrency-ts/api/StateMachine";

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
  create<T>(config: Config<T>): RequiredType<StateMachine<T>>;

  /**
   * Create a new StateMachine
   *
   * @param initialState the initial state
   * @return the new StateMachine
   * @param <T> the type of each state
   * @throws IllegalArgumentException if initialState is null
   */
  create<T>(initialState: T): RequiredType<StateMachine<T>>;
}

/**
 * Determine if the given instance is a StateMachineFactory
 *
 * @param instance the instance to check
 * @return true if the instance is a StateMachineFactory
 */
export function isStateMachineFactory(instance: unknown): instance is StateMachineFactory {
  return hasFunctions(instance, 'create');
}

/**
 * Contract for StateMachineFactory
 */ 
export const CONTRACT: Contract<StateMachineFactory> = createContract({
  name: "StateMachineFactory",
  test: isStateMachineFactory
});