import { Duration, MAX_TIMEOUT, OptionalType, RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { illegalCheck, presentCheck, configCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";

export { presentCheck, illegalCheck, configCheck };

/**
 * Check that a state is present
 *
 * @param state the state to check
 * @return the state if present
 * @throws IllegalArgumentException if the state is not present
 */
export function stateCheck<T>(state: T): T {
  return presentCheck(state, "State must be present.");
}

/**
 * Check that an event is present
 *
 * @param event the event to check
 * @return the event if present
 * @throws IllegalArgumentException if the event is not present
 */
export function eventCheck(event: string): string {
  return presentCheck(event, "Event must be present.");
}

/**
 * Check that a rule is present
 *
 * @param rule the rule to check
 * @return the rule if present
 * @throws IllegalArgumentException if the rule is not present
 */
export function ruleCheck<T>(rule: T): T {
  return presentCheck(rule, "Rule must be present.");
}

/**
 * Check that rules are present
 *
 * @param rules the rules to check
 * @return the rules if present
 * @throws IllegalArgumentException if the rules are not present
 */
export function rulesCheck<T>(rules: T[]): T[] {
  return presentCheck(rules, "Rules must be present.");
} 

/**
 * Check that a listener is present
 *
 * @param consumer the listener to check
 * @return the listener if present
 * @throws IllegalArgumentException if the listener is not present
 */
export function listenerCheck<T>(consumer: T): T {
  return presentCheck(consumer, "Listener must be present.");
}

/**
 * Check that a timeout is valid
 *
 * @param timeout the timeout to check
 * @return the timeout if valid
 * @throws IllegalArgumentException if the timeout is not valid
 */
export function timeoutCheck(timeout: Duration): Duration {
  const presentTimeout = presentCheck(timeout, "Timeout must be present.");
  illegalCheck(timeout, timeout.milliSeconds < 0, "Timeout must not be negative.");
  illegalCheck(timeout, timeout.milliSeconds > MAX_TIMEOUT.milliSeconds, "Timeout must be less than or equal to maximum time.");
  return presentTimeout;
}

/**
 * Check that a completion value is present
 *
 * @param completion the completion value to check
 * @return the completion value if present
 * @throws IllegalArgumentException if the completion value is not present
 */
export function completionCheck<T>(completion: OptionalType<T>): RequiredType<T> {
  return presentCheck(completion, "Completion must be present.");
}

/**
 * Check that an onCompletion consumer is present
 *
 * @param onCompletion the onCompletion consumer to check
 * @return the onCompletion consumer if present
 * @throws IllegalArgumentException if the onCompletion consumer is not present
 */
export function onCompletionCheck<T>(onCompletion: OptionalType<T>): RequiredType<T> {
  return presentCheck(onCompletion, "OnCompletion consumer must be present.");
} 

/**
 * Check that a finally block is present
 *
 * @param block the finally block to check
 * @return the finally block if present
 * @throws IllegalArgumentException if the finally block is not present
 */
export function finallyBlockCheck<T>(block: OptionalType<T>): RequiredType<T> {
  return presentCheck(block, "OnFinally consumer must be present.");
}

/**
 * Check that a success block is present
 *
 * @param onSuccess the success block to check
 * @return the success block if present
 * @throws IllegalArgumentException if the success block is not present
 */
export function successBlockCheck<T>(onSuccess: OptionalType<T>): RequiredType<T> {
  return presentCheck(onSuccess, "OnSuccess consumer must be present.");
}

/**
 * Check that a failure block is present
 *
 * @param onFailure the failure block to check
 * @return the failure block if present
 * @throws IllegalArgumentException if the failure block is not present
 */
export function failureBlockCheck<T>(onFailure: OptionalType<T>): RequiredType<T> {
  return presentCheck(onFailure, "OnFailure consumer must be present.");
}

/**
 * Check that a predicate is present
 *
 * @param predicate the predicate to check
 * @return the predicate if present
 * @throws IllegalArgumentException if the predicate is not present
 */
export function predicateCheck<T>(predicate: OptionalType<T>): RequiredType<T> {
  return presentCheck(predicate, "Predicate must be present.");
}

/**
 * Check that an initial value is present
 *
 * @param initialValue the initial value to check
 * @return the initial value if present
 * @throws IllegalArgumentException if the initial value is not present
 */
export function initialValueCheck<T>(initialValue: OptionalType<T>): RequiredType<T> {
  return presentCheck(initialValue, "Initial value must be present.");
}
