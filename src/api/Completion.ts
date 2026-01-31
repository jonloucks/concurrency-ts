import { IsCompleted } from "@jonloucks/concurrency-ts/api/IsCompleted";
import { OptionalType, RequiredType, Throwable, guardFunctions } from "@jonloucks/concurrency-ts/api/Types";
import { CompletionState } from "@jonloucks/concurrency-ts/api/CompletionState";

export { CompletionState };

/** Configuration for a Completion
 *
 * @param <T> the type of completion value  
 */
export interface Config<T> {

  /** The completion state */
  state: RequiredType<CompletionState>;

  /** The optional thrown exception */
  thrown?: OptionalType<Throwable<unknown>>;

  /** The optional completion value */
  value?: OptionalType<T>;

  /** The optional associated Future */
  promise?: OptionalType<Promise<T>>;
}

export { Config as CompletionConfig };

/**
 * Responsibility: Represent a progression step in the life cycle of an activity.
 */
export interface Completion<T> extends IsCompleted {

  /**
   * @return the completion state
   */
  getState(): RequiredType<CompletionState>;

  /**
   * @return optional thrown exception
   */
  getThrown(): OptionalType<Throwable<unknown>>;

  /**
   * @return the optional completion value
   */
  getValue(): OptionalType<T>;

  /**
   * @return the optional associated Future
   */
  getPromise(): OptionalType<Promise<T>>;

  /**
   * True if final completion
   * @return true if final completion
   */
  isCompleted(): boolean
}

/**
 * Determine if an instance implements Completion
 * 
 * @param instance the instance to check
 * @returns true if the instance implements Completion
 */
export function guard<T>(instance: unknown): instance is RequiredType<Completion<T>> {
  return guardFunctions(instance,
    'getState',
    'getThrown',
    'getValue',
    'getPromise',
    'isCompleted'
  );
} 