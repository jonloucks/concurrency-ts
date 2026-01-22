import { Completable, Config as CompletableConfig } from "@jonloucks/concurrency-ts/api/Completable";
import { Completion, Config as CompletionConfig } from "@jonloucks/concurrency-ts/api/Completion";
import { OnCompletion } from "@jonloucks/concurrency-ts/api/OnCompletion";
import { StateMachine } from "@jonloucks/concurrency-ts/api/StateMachine";
import { Consumer, Supplier } from "@jonloucks/concurrency-ts/api/Types";
import { Waitable } from "@jonloucks/concurrency-ts/api/Waitable";
import { AutoOpen, Contract, createContract, hasFunctions, OptionalType, RequiredType } from "@jonloucks/contracts-ts";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";

export { Completable, Config as CompletableConfig } from "@jonloucks/concurrency-ts/api/Completable";
export { Completion, Config as CompletionConfig } from "@jonloucks/concurrency-ts/api/Completion";
export { OnCompletion } from "@jonloucks/concurrency-ts/api/OnCompletion";
export { StateMachine } from "@jonloucks/concurrency-ts/api/StateMachine";
export { Consumer, Supplier } from "@jonloucks/concurrency-ts/api/Types";
export { Waitable } from "@jonloucks/concurrency-ts/api/Waitable";
export { Contracts } from "@jonloucks/contracts-ts/api/Contracts";

/**
 * The configuration used to create a new Concurrency instance.
 */
export interface Config {
  /**
   * @return the contracts, some use case have their own Contracts instance.
   */
  contracts?: OptionalType<Contracts>;
}

/**
 * The Concurrency API
 */
export interface Concurrency extends AutoOpen {

  /**
   * Create a new Waitable with the given initial value
   *
   * @param initialValue the initial value, null is allowed
   * @return the waitable
   * @param <T> the type of waitable
   */
  createWaitable<T>(initialValue: OptionalType<T>): RequiredType<Waitable<T>>;

  /**
   * Create a new StateMachine
   *
   * @param initialState the initial state
   * @return the new StateMachine
   * @param <T> the type of each state
   * @throws IllegalArgumentException if initialState is null
   */
  createStateMachine<T>(initialState: OptionalType<T>): RequiredType<StateMachine<T>>;

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
  completeLater<T>(onCompletion: RequiredType<OnCompletion<T>>, delegate: RequiredType<Consumer<OnCompletion<T>>>): void;

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
  completeNow<T>(onCompletion: RequiredType<OnCompletion<T>>, successBlock: RequiredType<Supplier<T>>): OptionalType<T>;
}

/**
 * Determine if the given instance is a Concurrency
 *
 * @param instance the instance to test
 * @return true if the instance is a Concurrency
 */
export function guard(instance: unknown): instance is Concurrency {
  return hasFunctions(instance,
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