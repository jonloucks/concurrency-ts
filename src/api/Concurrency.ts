import { Completable, Config as CompletableConfig } from "@jonloucks/concurrency-ts/api/Completable";
import { Completion, Config as CompletionConfig } from "@jonloucks/concurrency-ts/api/Completion";
import { OnCompletion } from "@jonloucks/concurrency-ts/api/OnCompletion";
import { StateMachine, Config as StateMachineConfig } from "@jonloucks/concurrency-ts/api/StateMachine";
import { Consumer, ConsumerType, guardFunctions, Supplier, SupplierType } from "@jonloucks/concurrency-ts/api/Types";
import { Waitable, Config as WaitableConfig } from "@jonloucks/concurrency-ts/api/Waitable";
import { Open } from "@jonloucks/contracts-ts/api/Open";
import { Contract, createContract, OptionalType, RequiredType } from "@jonloucks/contracts-ts";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";

export {
  Completable, 
  CompletableConfig,
  Completion,
  CompletionConfig,
  StateMachine,
  StateMachineConfig,
  Waitable,
  WaitableConfig,
  OnCompletion,
  Consumer,
  ConsumerType,
  Supplier,
  SupplierType,
  Contracts
}

/**
 * The configuration used to create a new Concurrency instance.
 */
export interface Config {
  /**
   * @return the contracts, some use case have their own Contracts instance.
   */
  contracts?: OptionalType<Contracts>;
}

export { Config as ConcurrencyConfig };

/**
 * The Concurrency API
 */
export interface Concurrency extends Open {

  /**
   * Create a new Waitable with the given configuration
   *
   * @param config the waitable configuration
   * @return the waitable
   * @param <T> the type of waitable
   */
  createWaitable<T>(config: WaitableConfig<T>): RequiredType<Waitable<T>>;

  /**
   * Create a new StateMachine
   *
   * @param config the state machine configuration
   * @return the new StateMachine
   * @param <T> the type of each state
   * @throws IllegalArgumentException if initialState is null
   */
  createStateMachine<T>(config: StateMachineConfig<T>): RequiredType<StateMachine<T>>;

  /**
   * Create a new Completable
   *
   * @param config the completable configuration
   * @return the new Completable
   * @param <T> the type of completion value
   */
  createCompletable<T>(config: CompletableConfig<T>): RequiredType<Completable<T>>;

  /**
   * Create a new Completion
   *
   * @param config the Completion configuration
   * @return the new Completable
   * @param <T> the type of completion value
   */
  createCompletion<T>(config: CompletionConfig<T>): RequiredType<Completion<T>>;

  /**
   * Guaranteed execution: complete later block.
   * Either the delegate successfully takes ownership of the OnCompletion or
   * a final FAILED completion is dispatched
   *
   * @param onCompletion the OnCompletion callback
   * @param delegate the intended delegate to receive the OnCompletion
   * @param <T> the completion value type
   */
  completeLater<T>(onCompletion: RequiredType<OnCompletion<T>>, delegate: RequiredType<ConsumerType<OnCompletion<T>>>): void;

  /**
   * Guaranteed execution: complete now block
   * When this method finishes, it is guaranteed the OnCompletion will have received a final completion.
   * Exceptions will result in a FAILED completion
   * Exceptions will be rethrown.
   *
   * @param onCompletion the OnCompletion callback
   * @param successBlock executed to determine the final completion value for an activity
   * @return the final completion value
   * @param <T> the completion value type
   */
  completeNow<T>(onCompletion: RequiredType<OnCompletion<T>>, successBlock: RequiredType<SupplierType<T>>): OptionalType<T>;
}

/**
 * Determine if the given instance is a Concurrency
 *
 * @param instance the instance to test
 * @return true if the instance is a Concurrency
 */
export function guard(instance: unknown): instance is RequiredType<Concurrency> {
  return guardFunctions(instance,
    'createWaitable',
    'createStateMachine',
    'createCompletable',
    'createCompletion',
    'completeLater',
    'completeNow',
    'open'
  );
}

/**
 * The Concurrency contract
 */
export const CONTRACT: Contract<Concurrency> = createContract<Concurrency>({
  name: "Concurrency",
  test: guard
});