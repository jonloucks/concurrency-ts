import { ConcurrencyFactory } from "@jonloucks/concurrency-ts/api/ConcurrencyFactory";
import { Concurrency, Config as ConcurrencyConfig } from "@jonloucks/concurrency-ts/api/Concurrency";

import { CONTRACT as WAITABLE_FACTORY } from "@jonloucks/concurrency-ts/api/WaitableFactory";
import { CONTRACT as STATE_MACHINE_FACTORY } from "@jonloucks/concurrency-ts/api/StateMachineFactory";
import { CONTRACT as COMPLETABLE_FACTORY } from "@jonloucks/concurrency-ts/api/CompletableFactory";

import { RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { CONTRACTS, Repository } from "@jonloucks/contracts-ts";
import { configCheck, presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";

import { create as createConcurrencyImpl } from "./Concurrency.impl";
import { create as createWaitableFactoryImpl } from "./WaitableFactory.impl";
import { create as createStateMachineFactoryImpl } from "./StateMachineFactory.impl";
import { create as createCompletableFactoryImpl } from "./CompletableFactory.impl";

/** 
 * Create a new ConcurrencyFactory
 * @param config the Concurrency Config
 *
 * @return the new ConcurrencyFactory
 */
export function create(config: ConcurrencyConfig): ConcurrencyFactory {
  return ConcurrencyFactoryImpl.internalCreate(config);
}

// ---- Implementation details below ----

class ConcurrencyFactoryImpl implements ConcurrencyFactory {

  createConcurrency(config: ConcurrencyConfig): Concurrency {
    return createConcurrencyImpl({ ...this._concurrencyConfig, ...config });
  }

  install(config: ConcurrencyConfig, repository: RequiredType<Repository>): void {
    // potential unexpected behavior might occur when merging configs
    const validConfig: ConcurrencyConfig = { ...this._concurrencyConfig, ...configCheck(config) };
    const validRepository: RequiredType<Repository> = presentCheck(repository, "Repository must be present.");

    validRepository.keep(WAITABLE_FACTORY, createWaitableFactoryImpl(validConfig));
    validRepository.keep(STATE_MACHINE_FACTORY, createStateMachineFactoryImpl(validConfig));
    validRepository.keep(COMPLETABLE_FACTORY, createCompletableFactoryImpl(validConfig));
  }

  static internalCreate(config: ConcurrencyConfig): ConcurrencyFactory {
    return new ConcurrencyFactoryImpl(config);
  }

  private constructor(config: ConcurrencyConfig) {
    this._concurrencyConfig = { ...{ contracts: CONTRACTS }, ...config };
  }

  private readonly _concurrencyConfig: ConcurrencyConfig;
}