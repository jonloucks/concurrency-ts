import { OptionalType, RequiredType, Throwable } from "@jonloucks/concurrency-ts/api/Types";
import { IsCompleted } from "@jonloucks/concurrency-ts/api/IsCompleted";
import { hasFunctions } from "@jonloucks/contracts-ts";

/**
 * The possible states of a Completion
 */
export type State =
    | 'PENDING'
    | 'FAILED'
    | 'CANCELLED'
    | 'SUCCEEDED';

/** Configuration for a Completion
 *
 * @param <T> the type of completion value  
 */
export interface Config<T> {

  /** The optional completion state */
  state?: OptionalType<State>;

  /** The optional thrown exception */
  thrown?: OptionalType<Throwable<unknown>>;

  /** The optional completion value */
  value?: OptionalType<T>;

  /** The optional associated Future */
  promise?: OptionalType<Promise<T>>;
}

/**
 * Responsibility: Represent a progression step in the life cycle of an activity.
 */
export interface Completion<T> extends IsCompleted {

  /**
   * @return the completion state
   */
  getState(): RequiredType<State>;

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
export function isCompletion<T>(instance: unknown): instance is Completion<T> {
  return hasFunctions(instance,
    'getState',
    'getThrown',
    'getValue',
    'getPromise',
    'isCompleted'
  );
} 