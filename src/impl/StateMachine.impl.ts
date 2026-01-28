import { Config, StateMachine } from "@jonloucks/concurrency-ts/api/StateMachine";
import { Transition } from "@jonloucks/concurrency-ts/api/Transition";
import { Duration, isPresent, OptionalType, RequiredType, Supplier } from "@jonloucks/concurrency-ts/api/Types";
import { Waitable } from "@jonloucks/concurrency-ts/api/Waitable";
import { Type as ConsumerType } from "@jonloucks/concurrency-ts/auxiliary/Consumer";
import { Type as PredicateType } from "@jonloucks/concurrency-ts/auxiliary/Predicate";
import { AutoClose } from "@jonloucks/contracts-ts";
import { Rule } from "@jonloucks/concurrency-ts/api/Rule";
import { ConcurrencyException } from "@jonloucks/concurrency-ts/api/ConcurrencyException";
import { configCheck, eventCheck, illegalCheck, initialValueCheck, presentCheck, ruleCheck, rulesCheck, stateCheck } from "@jonloucks/concurrency-ts/auxiliary/Checks";
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
  open() : AutoClose {
    return this.currentState.open();
  }

  // StateMachine.setState implementation
  setState(event: string, state: S): boolean {
    if (this.isTransitionAllowed(event, stateCheck(state))) {
      this.currentState.consume(state);
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
    return this.stateToRulesLookup.has(stateCheck(state));
  }

  // StateMachine.isTransitionAllowed implementation
  isTransitionAllowed(event: string, state: S): boolean {
    const validEvent: string = eventCheck(event);
    const toState: S = stateCheck(state);
    const fromState: S = this.getState();
    if (this.hasState(toState) && fromState !== toState) {
      const rules: Set<Rule<S>> | undefined = this.stateToRulesLookup.get(fromState);
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
    return this.currentState.supply();
  }

  // StateMachine.supplyIf implementation
  supplyIf(predicate: PredicateType<S>): OptionalType<S> {
    return this.currentState.supplyIf(predicate);
  }

  // StateMachine.supplyWhen implementation
  async supplyWhen(predicate: RequiredType<PredicateType<S>>, timeout?: Duration): Promise<S> {
    return this.currentState.supplyWhen(predicate, timeout);
  }

  // StateMachine.notifyWhile implementation
  notifyWhile(predicate: RequiredType<PredicateType<S>>, listener: RequiredType<ConsumerType<S>>): RequiredType<AutoClose> {
    return this.currentState.notifyWhile(predicate, listener);
  }

  static internalCreate<T>(config: Config<T>): StateMachine<T> {
    return new StateMachineImpl<T>(config);
  }

  private addStateAndRules(state: S, rules: Rule<S>[]): void {
    const validState = stateCheck(state);
    const validRules = rulesCheck(rules);
    const knownRules = this.getStateRules(validState);
    validRules.forEach(rule => knownRules.add(ruleCheck(rule)));
  }

  private getStateRules(state: S): Set<Rule<S>> {
    if (!this.stateToRulesLookup.has(state)) {
      this.stateToRulesLookup.set(state, new Set<Rule<S>>());
    }
    return this.stateToRulesLookup.get(state)!;
  }

  private transitionCheck<R>(transition: Transition<S, R>): Transition<S, R> {
    const validTransition: Transition<S, R> = presentCheck(transition, "Transition must be present.");

    this.existsCheck(validTransition.getSuccessState());

    eventCheck(validTransition.getEvent());

    return validTransition;
  }

  private isAllowed<R>(transition: Transition<S, R>): boolean {
    return this.isTransitionAllowed(transition.getEvent(), transition.getSuccessState());
  }

  private handleSuccess<R>(transition: Transition<S, R>): OptionalType<R> {
    const value: OptionalType<R> = this.optionalSupplierValue(transition.getSuccessValue());
    this.setState(transition.getEvent(), transition.getSuccessState());
    return value;
  }

  private optionalSupplierValue<Z>(supplier: OptionalType<Supplier<Z>>): OptionalType<Z> {
    if (isPresent(supplier)) {
      return supplier.supply();
    }
    return undefined;
  }

  private handleFailure<R>(transition: Transition<S, R>): R {
    this.setOptionalState(transition.getFailedState(), transition.getEvent());
    const onFailure: OptionalType<Supplier<R>> = transition.getFailedValue();
    if (isPresent(onFailure)) {
      return onFailure.supply();
    } else {
      throw new ConcurrencyException("Illegal state transition from " + String(this.getState()) +
        " to " + String(transition.getSuccessState()) + ".");
    }
  }

  private handleError<R>(transition: Transition<S, R>, thrown: unknown): R {
    this.setOptionalState(transition.getErrorState(), transition.getEvent());
    const onError: OptionalType<Supplier<R>> = transition.getErrorValue();
    if (isPresent(onError)) {
      return onError.supply();
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

  private constructor(config: Config<S>) {
    const validConfig: Config<S> = configCheck(config);
    const initialState: S = initialValueCheck(validConfig.initialValue);

    this.currentState = createWaitable<S>({ initialValue: initialState });
    this.addStateAndRules(initialState, []);
    if (isPresent(validConfig.states) && validConfig.states.length > 0) {
      validConfig.states.forEach(state => {
        this.addStateAndRules(state, validConfig.getStateRules(state) ?? []);
      });
    }
  }

  private readonly stateToRulesLookup: Map<S, Set<Rule<S>>> = new Map<S, Set<Rule<S>>>();
  private readonly currentState: Waitable<S>;
};