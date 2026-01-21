import { AutoOpen } from "@jonloucks/contracts-ts/api/AutoOpen";
import { Completion, State as CompletionState } from "@jonloucks/concurrency-ts/api/Completion";
import { CompletionNotify } from "@jonloucks/concurrency-ts/api/CompletionNotify";
import { OnCompletion } from "@jonloucks/concurrency-ts/api/OnCompletion";
import { WaitableNotify } from "@jonloucks/concurrency-ts/api/WaitableNotify";
import { IsCompleted } from "@jonloucks/concurrency-ts/api/IsCompleted";
import { OptionalType } from "./Types";
import { hasFunctions } from "@jonloucks/contracts-ts";

/**
 * Configuration for a Completable
 *
 * @param <T> the type of completion value  
 */
export interface Config<T> {
  intiatialValue?: OptionalType<T>;
}

/**
 * Responsibility: Observe a single activity from start to finish
 *
 * @param <T> the type of completion value
 */
export interface Completable<T> extends AutoOpen, CompletionNotify<T>, OnCompletion<T>, IsCompleted {

  /**
   * @return observe state change
   */
  notifyState(): WaitableNotify<CompletionState>

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
export function isCompletable<T>(instance: unknown): instance is Completable<T> {
  return hasFunctions(instance,
    'open',
    'notifyState',
    'notifyValue',
    'getCompletion',
    'isCompleted',
    'onCompletion',
    'notify'
  );
}