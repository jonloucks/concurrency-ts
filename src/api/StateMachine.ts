import { Rule } from "@jonloucks/concurrency-ts/api/Rule";
import { Transition } from "@jonloucks/concurrency-ts/api/Transition";
import { OptionalType, RequiredType, guardFunctions } from "@jonloucks/concurrency-ts/api/Types";
import { WaitableNotify, guard as guardWaitableNotify } from "@jonloucks/concurrency-ts/api/WaitableNotify";
import { WaitableSupplier, guard as guardWaitableSupplier } from "@jonloucks/concurrency-ts/api/WaitableSupplier";
import { Open } from "@jonloucks/contracts-ts/api/Open";


/**
 * State machine.
 * User defined states with rules to restrict state transitions.
 *
 * @param <T> the user defined state type
 */
export interface StateMachine<T> extends Open, WaitableSupplier<T>, WaitableNotify<T> {

  /**
   * Set the current state, state must already exist and be an allowed transition
   *
   * @param event the event name
   * @param state the new state
   * @return true if state was changed
   * @throws IllegalArgumentException when event is null, state is null, or unknown
   */
  setState(event: string, state: T): boolean;

  /**
   * Get the current state
   *
   * @return the current state, never null
   */
  getState(): T;

  /**
   * Determine if the given state is known
   *
   * @param state the state to check
   * @return true if and only if the state is known
   * @throws IllegalArgumentException when state is null
   */
  hasState(state: T): boolean;

  /**
   * Determine if a transition is allowed from the current state to a new one.
   *
   * @param event the event that is triggering the transition
   * @param state the candidate state to transition to
   * @return if transition event is allowed to change the current state to the given state
   * @throws IllegalArgumentException when event is null, state is null, or unknown
   */
  isTransitionAllowed(event: string, state: T): boolean;

  /**
   * Execute a transition from the current state to another
   *
   * @param transition the transition to execute
   * @param <R>        the return type of the transition. For example, a Closeable during open.
   * @return the transition return value
   * @throws IllegalArgumentException when transition is null or required fields are not present.
   */
  transition<R>(transition: Transition<T, R>): OptionalType<R>;
}

/**
 * StateMachine configuration
 *
 * @param <T> the type of each state
 */
export interface Config<T> {

  /**
   * Return the initial value. It is required, the use of required is because
   * the builder may not have provided a value
   *
   * @return the optional initial state
   */
  initialValue?: OptionalType<T>;

  /**
   * @return the list of states in the state machine
   */
  states: Array<T>;

  /**
   * Get all the rules for a specified state
   *
   * @param state the state
   * @return the rules of the state
   */
  getStateRules(state: T): Array<Rule<T>>;
}

/**
 * Determine if the given instance is a StateMachine
 *
 * @param instance the instance to check
 * @return true if the instance is a StateMachine
 */
export function guard<T>(instance: unknown): instance is RequiredType<StateMachine<T>> {
  return guardFunctions(instance,
    'isTransitionAllowed',
    'getState',
    'setState',
    'hasState',
    'transition',
    'open'
  ) && guardWaitableNotify<T>(instance) && guardWaitableSupplier<T>(instance);
}