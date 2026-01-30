import {
  Completable, CompletableConfig, Completion, CompletionConfig, Concurrency,
  ConcurrencyConfig, OnCompletion, StateMachine, StateMachineConfig, Waitable, WaitableConfig
}
  from "@jonloucks/concurrency-ts/api/Concurrency";

import { CONTRACT as WAITABLE_FACTORY } from "@jonloucks/concurrency-ts/api/WaitableFactory";
import { CONTRACT as STATE_MACHINE_FACTORY } from "@jonloucks/concurrency-ts/api/StateMachineFactory";
import { CONTRACT as COMPLETABLE_FACTORY } from "@jonloucks/concurrency-ts/api/CompletableFactory";
import { CONTRACT as COMPLETION_FACTORY } from "@jonloucks/concurrency-ts/api/CompletionFactory";

import { Consumer, OptionalType, RequiredType, Supplier } from "@jonloucks/concurrency-ts/api/Types";
import { AutoClose, Contracts, CONTRACTS } from "@jonloucks/contracts-ts";
import { AUTO_CLOSE_NONE } from "@jonloucks/contracts-ts/api/AutoClose";

export function create(config: ConcurrencyConfig): Concurrency {
  return ConcurrencyImpl.internalCreate(config);
}

// ---- Implementation details below ----

class ConcurrencyImpl implements Concurrency {

  open(): AutoClose {
    // need to initialize factories here if they have not been initialized yet
    return AUTO_CLOSE_NONE;
  }

  createWaitable<T>(config: WaitableConfig<T>): RequiredType<Waitable<T>> {
    return this.contracts.enforce(WAITABLE_FACTORY).createWaitable<T>(config);
  }

  createStateMachine<T>(config: StateMachineConfig<T>): RequiredType<StateMachine<T>> {
    return this.contracts.enforce(STATE_MACHINE_FACTORY).createStateMachine<T>(config);
  }

  createCompletable<T>(config: CompletableConfig<T>): RequiredType<Completable<T>> {
    return this.contracts.enforce(COMPLETABLE_FACTORY).createCompletable<T>(config);
  }

  createCompletion<T>(config: CompletionConfig<T>): RequiredType<Completion<T>> {
    return this.contracts.enforce(COMPLETION_FACTORY).createCompletion<T>(config);
  }

  completeLater<T>(_onCompletion: RequiredType<OnCompletion<T>>, _delegate: RequiredType<Consumer<OnCompletion<T>>>): void {
    throw new Error("Method not implemented.");
  }

  completeNow<T>(_onCompletion: RequiredType<OnCompletion<T>>, _successBlock: RequiredType<Supplier<T>>): OptionalType<T> {
    throw new Error("Method not implemented.");
  }

  static internalCreate(config: ConcurrencyConfig): Concurrency {
    return new ConcurrencyImpl(config);
  }

  private constructor(config: ConcurrencyConfig) {
    this.concurrencyConfig = { ...{ contracts: CONTRACTS }, ...config };
    this.contracts = this.concurrencyConfig.contracts!;
  }

  private readonly contracts: Contracts;
  private readonly concurrencyConfig: ConcurrencyConfig;
}