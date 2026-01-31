import {
  Completable, 
  CompletableConfig, 
  Concurrency,
  ConcurrencyConfig, 
  OnCompletion, 
  StateMachine, 
  StateMachineConfig, 
  Waitable, 
  WaitableConfig
}
  from "@jonloucks/concurrency-ts/api/Concurrency";

import { CONTRACT as WAITABLE_FACTORY } from "@jonloucks/concurrency-ts/api/WaitableFactory";
import { CONTRACT as STATE_MACHINE_FACTORY } from "@jonloucks/concurrency-ts/api/StateMachineFactory";
import { CONTRACT as COMPLETABLE_FACTORY } from "@jonloucks/concurrency-ts/api/CompletableFactory";

import { ConsumerType, OptionalType, RequiredType, SupplierType } from "@jonloucks/concurrency-ts/api/Types";
import { Contracts, CONTRACTS } from "@jonloucks/contracts-ts";
import { AutoClose, AUTO_CLOSE_NONE } from "@jonloucks/contracts-ts/api/AutoClose";

import { completeLater as completeLaterImpl } from "./CompleteLater.impl";
import { completeNow as completeNowImpl } from "./CompleteNow.impl";

/** 
 * Create a new Concurrency
 *
 * @param config the concurrency configuration
 * @return the new Concurrency
 */
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
    return this._contracts.enforce(WAITABLE_FACTORY).createWaitable<T>(config);
  }

  createStateMachine<T>(config: StateMachineConfig<T>): RequiredType<StateMachine<T>> {
    return this._contracts.enforce(STATE_MACHINE_FACTORY).createStateMachine<T>(config);
  }

  createCompletable<T>(config: CompletableConfig<T>): RequiredType<Completable<T>> {
    return this._contracts.enforce(COMPLETABLE_FACTORY).createCompletable<T>(config);
  }

  completeLater<T>(onCompletion: RequiredType<OnCompletion<T>>, delegate: RequiredType<ConsumerType<OnCompletion<T>>>): void {
    completeLaterImpl(onCompletion, delegate);
  }

  completeNow<T>(onCompletion: RequiredType<OnCompletion<T>>, successBlock: RequiredType<SupplierType<T>>): OptionalType<T> {
    return completeNowImpl(onCompletion, successBlock);
  }

  static internalCreate(config: ConcurrencyConfig): Concurrency {
    return new ConcurrencyImpl(config);
  }

  private constructor(config: ConcurrencyConfig) {
    this._concurrencyConfig = { ...{ contracts: CONTRACTS }, ...config };
    this._contracts = this._concurrencyConfig.contracts!;
  }

  private readonly _contracts: Contracts;
  private readonly _concurrencyConfig: ConcurrencyConfig;
}