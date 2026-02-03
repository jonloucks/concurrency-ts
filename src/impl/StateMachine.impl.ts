import { ConcurrencyException } from "@jonloucks/concurrency-ts/api/ConcurrencyException";
import { Rule } from "@jonloucks/concurrency-ts/api/Rule";
import { Config, StateMachine } from "@jonloucks/concurrency-ts/api/StateMachine";
import { Transition } from "@jonloucks/concurrency-ts/api/Transition";
import { Duration, isPresent, OptionalType, RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { Waitable } from "@jonloucks/concurrency-ts/api/Waitable";
import { eventCheck, illegalCheck, initialValueCheck, presentCheck, ruleCheck, rulesCheck, stateCheck } from "@jonloucks/concurrency-ts/auxiliary/Checks";
import { Type as ConsumerType } from "@jonloucks/concurrency-ts/auxiliary/Consumer";
import { Type as PredicateType } from "@jonloucks/concurrency-ts/auxiliary/Predicate";
import { AutoClose } from "@jonloucks/contracts-ts/api/AutoClose";

import { create as createWaitable } from "./Waitable.impl";

/** 
 * Create a new StateMachine
 *
 * @return the new StateMachine
 */
export function create<T>(config: RequiredType<Config<T>>): StateMachine<T> {
  return StateMachineImpl.internalCreate(config);
}

// ---- Implementation details below ----

class StateMachineImpl<S> implements StateMachine<S> {

  // Statemachine.open
  open(): AutoClose {
    return this._currentState.open();
  }

  // IsCompleted.
  isCompleted(): boolean {
    return this._isCompleted;
  }

  // StateMachine.setState implementation
  setState(event: string, state: S): boolean {
    if (this.isTransitionAllowed(event, stateCheck(state))) {
      this._currentState.consume(state);
      this.updateIsCompleted(state);
      return true;
    }
    return false;
  }

  // StateMachine.getState implementation
  getState(): S {
    return this.supply();
  }

  // StateMachine.hasState implementation
  hasState(state: S): boolean {
    return this._stateToRulesLookup.has(stateCheck(state));
  }

  // StateMachine.isTransitionAllowed implementation
  isTransitionAllowed(event: string, state: S): boolean {
    const validEvent: string = eventCheck(event);
    const toState: S = stateCheck(state);
    const fromState: S = this.getState();
    if (this.hasState(toState) && fromState !== toState) {
      const rules: Set<Rule<S>> | undefined = this._stateToRulesLookup.get(fromState);
      if (isPresent(rules) && rules.size > 0) {
        return Array.from(rules).every((r) => r.canTransition(validEvent, toState));
      }
      return true;
    }
    return false;
  }

  // StateMachine.transition implementation
  transition<R>(transition: Transition<S, R>): OptionalType<R> {
    const t: Transition<S, R> = this.transitionCheck(transition);
    if (this.isAllowed(t)) {
      try {
        return this.handleSuccess(t);
      } catch (thrown) {
        return this.handleError(t, thrown);
      }
    } else {
      return this.handleFailure(t);
    }
  }

  // StateMachine.supply implementations
  supply(): S {
    return this._currentState.supply();
  }

  // StateMachine.supplyIf implementation
  supplyIf(predicate: PredicateType<S>): OptionalType<S> {
    return this._currentState.supplyIf(predicate);
  }

  // StateMachine.supplyWhen implementation
  async supplyWhen(predicate: RequiredType<PredicateType<S>>, timeout?: Duration): Promise<S> {
    return this._currentState.supplyWhen(predicate, timeout);
  }

  // StateMachine.notifyWhile implementation
  notifyWhile(predicate: RequiredType<PredicateType<S>>, listener: RequiredType<ConsumerType<S>>): RequiredType<AutoClose> {
    return this._currentState.notifyWhile(predicate, listener);
  }

  static internalCreate<T>(config: Config<T>): StateMachine<T> {
    return new StateMachineImpl<T>(config);
  }

  private addStateAndRules(state: S, rules: readonly Rule<S>[]): void {
    const validState = stateCheck(state);
    const validRules = rulesCheck(rules);
    const knownRules = this.getStateRules(validState);
    validRules.forEach(rule => knownRules.add(ruleCheck(rule)));
  }

  private getStateRules(state: S): Set<Rule<S>> {
    if (!this._stateToRulesLookup.has(state)) {
      this._stateToRulesLookup.set(state, new Set<Rule<S>>());
    }
    return this._stateToRulesLookup.get(state)!;
  }

  private transitionCheck<R>(transition: Transition<S, R>): Transition<S, R> {
    const validTransition: Transition<S, R> = presentCheck(transition, "Transition must be present.");
    this.existsCheck(validTransition.successState);
    eventCheck(validTransition.event);
    return validTransition;
  }

  private isAllowed<R>(transition: Transition<S, R>): boolean {
    return this.isTransitionAllowed(transition.event, transition.successState);
  }

  private handleSuccess<R>(transition: Transition<S, R>): OptionalType<R> {
    const value: OptionalType<R> = transition.getSuccessValue?.();
    this.setState(transition.event, transition.successState);
    return value;
  }

  private handleFailure<R>(transition: Transition<S, R>): R {
    this.setOptionalState(transition.failedState, transition.event);
    const value: OptionalType<R> = transition.getFailedValue?.();

    if (isPresent(value)) {
      return value;
    } else {
      throw new ConcurrencyException("Illegal state transition from " + String(this.getState()) +
        " to " + String(transition.successState) + ".");
    }
  }

  private handleError<R>(transition: Transition<S, R>, thrown: unknown): R {
    this.setOptionalState(transition.errorState, transition.event);
    const value: OptionalType<R> = transition.getErrorValue?.();

    if (isPresent(value)) {
      return value;
    } else {
      throw ConcurrencyException.rethrow(thrown);
    }
  }

  private setOptionalState(optional: OptionalType<S>, event: string): void {
    if (isPresent(optional)) {
      this.setState(event, optional);
    }
  }

  private existsCheck(state: S): S {
    const validState = stateCheck(state);
    return illegalCheck(validState, !this.hasState(validState), "State must be known.");
  }

  private updateIsCompleted(state: S): void {
    const rules: Set<Rule<S>> | undefined = this._stateToRulesLookup.get(state);
    if (isPresent(rules) && rules.size > 0) {
      for (const rule of rules) {
        if (rule.isTerminal) {
          this._isCompleted = true;
          return;
        }
      }
    }
  }

  private constructor(config: Config<S>) {
    const validConfig: Config<S> = config ?? {};
    const initialState: S = initialValueCheck(validConfig.initialValue);

    this._currentState = createWaitable<S>({ initialValue: initialState });
    this.addStateAndRules(initialState, []);
    if (isPresent(validConfig.states) && validConfig.states.length > 0) {
      validConfig.states.forEach(state => {
        this.addStateAndRules(state, validConfig.getStateRules?.(state) ?? []);
      });
    }
  }

  private readonly _stateToRulesLookup: Map<S, Set<Rule<S>>> = new Map<S, Set<Rule<S>>>();
  private readonly _currentState: Waitable<S>;
  private _isCompleted: boolean = false;
};