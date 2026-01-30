import { Completion, CompletionState } from "@jonloucks/concurrency-ts/api/Completion";
import { CompletionNotify } from "@jonloucks/concurrency-ts/api/CompletionNotify";
import { IsCompleted } from "@jonloucks/concurrency-ts/api/IsCompleted";
import { OnCompletion } from "@jonloucks/concurrency-ts/api/OnCompletion";
import { OptionalType, RequiredType, guardFunctions } from "@jonloucks/concurrency-ts/api/Types";
import { WaitableNotify } from "@jonloucks/concurrency-ts/api/WaitableNotify";
import { Contracts } from "@jonloucks/contracts-ts";
import { Open } from "@jonloucks/contracts-ts/api/Open";

/**
 * Configuration for a Completable
 *
 * @param <T> the type of completion value  
 */
export interface Config<T> {
  /**
   * Optional contracts for validation or other purposes
   */
  contracts: Contracts;

  /**
   * Optional initial value for the completable
   */
  initialValue?: OptionalType<T>;
}

export { Config as CompletableConfig };

/**
 * Responsibility: Observe a single activity from start to finish
 *
 * @param <T> the type of completion value
 */
export interface Completable<T> extends Open, CompletionNotify<T>, OnCompletion<T>, IsCompleted {

  /**
   * @return observe state change
   */
  notifyState(): WaitableNotify<CompletionState>;

  /**
   * @return Observe the completed value
   */
  notifyValue(): WaitableNotify<T>;

  /**
   * @return the current completion state
   */
  getCompletion(): OptionalType<Completion<T>>;
}

/**
 * Determine if an instance implements Completable
 * 
 * @param instance the instance to check
 * @returns true if the instance implements Completable
 */
export function guard<T>(instance: unknown): instance is RequiredType<Completable<T>> {
  return guardFunctions(instance,
    'open',
    'notifyState',
    'notifyValue',
    'getCompletion',
    'isCompleted',
    'onCompletion',
    'notify'
  );
}