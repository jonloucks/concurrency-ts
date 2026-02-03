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
} from "@jonloucks/concurrency-ts/api/Concurrency";

import { CONTRACT as COMPLETABLE_FACTORY } from "@jonloucks/concurrency-ts/api/CompletableFactory";
import { CONTRACT as STATE_MACHINE_FACTORY } from "@jonloucks/concurrency-ts/api/StateMachineFactory";
import { ConsumerType, OptionalType, RequiredType, SupplierType } from "@jonloucks/concurrency-ts/api/Types";
import { CONTRACT as WAITABLE_FACTORY } from "@jonloucks/concurrency-ts/api/WaitableFactory";
import { Contracts } from "@jonloucks/contracts-ts";
import { AutoClose, AutoCloseMany } from "@jonloucks/contracts-ts/api/AutoClose";
import { CONTRACT as AUTO_CLOSE_FACTORY } from "@jonloucks/contracts-ts/api/AutoCloseFactory";
import { CONTRACT as IDEMPOTENT_FACTORY } from "@jonloucks/contracts-ts/auxiliary/IdempotentFactory";

import { completeLater as completeLaterImpl } from "./CompleteLater.impl";
import { completeNow as completeNowImpl } from "./CompleteNow.impl";
import { create as createEvents, Events } from "./Events.impl";
import { Internal } from "./Internal.impl";
import { Idempotent } from "@jonloucks/contracts-ts/auxiliary/Idempotent";

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
    return this._idempotent.open();
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
    this._idempotent = this._contracts.enforce(IDEMPOTENT_FACTORY).createIdempotent({
      open: () => this.firstOpen()
    });
  }

  private readonly _contracts: Contracts;
  private readonly _config: ConcurrencyConfig;
  private readonly _closeMany: AutoCloseMany;
  private readonly _idempotent: Idempotent;
}