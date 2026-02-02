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
import { CONTRACT as IDEMPOTENT_FACTORY } from "@jonloucks/concurrency-ts/api/IdempotentFactory";
import { ConsumerType, isNotPresent, OptionalType, RequiredType, SupplierType } from "@jonloucks/concurrency-ts/api/Types";
import { Contracts } from "@jonloucks/contracts-ts";
import { Idempotent } from "@jonloucks/concurrency-ts/api/Idempotent";
import { AutoClose, AutoCloseMany } from "@jonloucks/contracts-ts/api/AutoClose";
import { CONTRACT as AUTO_CLOSE_FACTORY } from "@jonloucks/contracts-ts/api/AutoCloseFactory";

import { completeLater as completeLaterImpl } from "./CompleteLater.impl";
import { completeNow as completeNowImpl } from "./CompleteNow.impl";
import { Events, create as createEvents } from "./Events.impl";
import { Internal } from "./Internal.impl";

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
    return this.getIdempotent().open();
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

  private firstOpen(): AutoClose {
    // register shutdown events last to avoid potential for events firing before everything is ready
    this._closeMany.add(this.registerEvents());
    return this._closeMany;
  }

  private firstClose(): void {
    this._closeMany.close();
  }

  private getIdempotent(): Idempotent {
    if (isNotPresent(this._lazy_idempotent)) {
      this._lazy_idempotent = this._contracts.enforce(IDEMPOTENT_FACTORY).createIdempotent({
        open: () => this.firstOpen()
      });
    }
    return this._lazy_idempotent;
  }

  private registerEvents(): AutoClose {
    const events: Events = createEvents({
      contracts: this._contracts,
      names: this._config.shutdownEvents ?? [],
      callback: () => this.firstClose()
    });
    return events.open();
  }

  private constructor(config: ConcurrencyConfig) {
    this._contracts = Internal.resolveContracts(config);
    this._config = { ...config, contracts: this._contracts };
    this._closeMany = this._contracts.enforce(AUTO_CLOSE_FACTORY).createAutoCloseMany();
  }

  private readonly _contracts: Contracts;
  private readonly _config: ConcurrencyConfig;
  private readonly _closeMany: AutoCloseMany;

  // lazy initialized members
  private _lazy_idempotent: Idempotent | undefined;
}