import { OptionalType, Supplier } from "@jonloucks/concurrency-ts/api/Types";
import { hasFunctions } from "@jonloucks/contracts-ts";

/**
 * Defines how a transition between states will be done
 *
 * @param <R> return type of the transition
 */
export interface Transition<S, R> {

  /**
   * @return the name of the event
   */
  getEvent(): string;

  /**
   * @return the success state of this transition
   */
  getSuccessState(): S;

  /**
   * @return the optional state if an exception is thrown
   */
  getErrorState(): OptionalType<S>;

  /**
   * @return the optional state if the transition is not allowed
   */
  getFailedState(): OptionalType<S>;

  /**
   * @return the optional return value on success
   */
  getSuccessValue(): OptionalType<Supplier<R>>;

  /**
   * @return the optional return value on exception thrown
   */
  getErrorValue(): OptionalType<Supplier<R>>;

  /**
   * @return the optional return value if transition is not allowed
   */
  getFailedValue(): OptionalType<Supplier<R>>;
}

/**
 * Type guard to determine if an instance implements Transition
 *
 * @param instance the instance to check
 * @return true if instance is a Transition
 */
export function guard<S, R>(instance: unknown): instance is Transition<S, R> {
  return hasFunctions(
    instance,
    'getEvent',
    'getSuccessState',
    'getErrorState',
    'getFailedState',
    'getSuccessValue',
    'getErrorValue',
    'getFailedValue'
  );
} 