import { Duration, MAX_TIMEOUT, OptionalType, RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { illegalCheck, presentCheck, configCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";

export { presentCheck, illegalCheck, configCheck };

export function stateCheck<T>(state: T): T {
  return presentCheck(state, "State must be present.");
}

export function eventCheck(event: string): string {
  return presentCheck(event, "Event must be present.");
}

export function ruleCheck<T>(rule: T): T {
  return presentCheck(rule, "Rule must be present.");
}

export function rulesCheck<T>(rules: T[]): T[] {
  return presentCheck(rules, "Rules must be present.");
} 

export function listenerCheck<T>(consumer: T): T {
  return presentCheck(consumer, "Listener must be present.");
}

export function timeoutCheck(timeout: Duration): Duration {
  const presentTimeout = presentCheck(timeout, "Timeout must be present.");
  illegalCheck(timeout, timeout.milliSeconds < 0, "Timeout must not be negative.");
  illegalCheck(timeout, timeout.milliSeconds > MAX_TIMEOUT.milliSeconds, "Timeout must be less than or equal to maximum time.");
  return presentTimeout;
}

export function completionCheck<T>(completion: OptionalType<T>): RequiredType<T> {
  return presentCheck(completion, "Completion must be present.");
}

export function onCompletionCheck<T>(onCompletion: OptionalType<T>): RequiredType<T> {
  return presentCheck(onCompletion, "OnCompletion consumer must be present.");
} 

export function finallyBlockCheck<T>(block: OptionalType<T>): RequiredType<T> {
  return presentCheck(block, "OnFinally consumer must be present.");
}

export function successBlockCheck<T>(onSuccess: OptionalType<T>): RequiredType<T> {
  return presentCheck(onSuccess, "OnSuccess consumer must be present.");
}

export function failureBlockCheck<T>(onFailure: OptionalType<T>): RequiredType<T> {
  return presentCheck(onFailure, "OnFailure consumer must be present.");
}

export function predicateCheck<T>(predicate: OptionalType<T>): RequiredType<T> {
  return presentCheck(predicate, "Predicate must be present.");
}

export function initialValueCheck<T>(initialValue: OptionalType<T>): RequiredType<T> {
  return presentCheck(initialValue, "Initial value must be present.");
}
