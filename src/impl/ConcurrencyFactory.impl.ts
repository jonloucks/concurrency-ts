import { ConcurrencyFactory } from "@jonloucks/concurrency-ts/api/ConcurrencyFactory";
import { Concurrency, Config as ConcurrencyConfig } from "@jonloucks/concurrency-ts/api/Concurrency";

import { CONTRACT as WAITABLE_FACTORY } from "@jonloucks/concurrency-ts/api/WaitableFactory";
import { CONTRACT as STATE_MACHINE_FACTORY } from "@jonloucks/concurrency-ts/api/StateMachineFactory";
import { CONTRACT as COMPLETABLE_FACTORY } from "@jonloucks/concurrency-ts/api/CompletableFactory";
import { CONTRACT as COMPLETION_FACTORY } from "@jonloucks/concurrency-ts/api/CompletionFactory";

import { RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { CONTRACTS, Repository } from "@jonloucks/contracts-ts";
import { configCheck, presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";

import { create as createConcurrencyImpl } from "./Concurrency.impl";
import { create as createWaitableFactoryImpl } from "./WaitableFactory.impl";
import { create as createStateMachineFactoryImpl } from "./StateMachineFactory.impl";
import { create as createCompletableFactoryImpl } from "./CompletableFactory.impl";
import { create as createCompletionFactoryImpl } from "./CompletionFactory.impl";

/** 
 * Create a new ConcurrencyFactory
 * @param config the Concurency Config
 *
 * @return the new ConcurrencyFactory
 */
export function create(config: ConcurrencyConfig): ConcurrencyFactory {
  return ConcurrencyFactoryImpl.internalCreate(config);
}

// ---- Implementation details below ----

class ConcurrencyFactoryImpl implements ConcurrencyFactory {

  createConcurrency(config: ConcurrencyConfig): Concurrency {
    return createConcurrencyImpl({ ...this.concurrencyConfig, ...config });
  }

  install(config: ConcurrencyConfig, repository: RequiredType<Repository>): void {
    // potential unexpected behavior might occur when merging configs
    const validConfig: ConcurrencyConfig = { ...this.concurrencyConfig, ...configCheck(config) };
    const validRepository: RequiredType<Repository> = presentCheck(repository, "Repository must be present.");

    validRepository.keep(WAITABLE_FACTORY, createWaitableFactoryImpl(validConfig));
    validRepository.keep(STATE_MACHINE_FACTORY, createStateMachineFactoryImpl(validConfig));
    validRepository.keep(COMPLETABLE_FACTORY, createCompletableFactoryImpl(validConfig));
    validRepository.keep(COMPLETION_FACTORY, createCompletionFactoryImpl(validConfig));
  }

  static internalCreate(config: ConcurrencyConfig): ConcurrencyFactory {
    return new ConcurrencyFactoryImpl(config);
  }

  private constructor(config: ConcurrencyConfig) {
    this.concurrencyConfig = { ...{ contracts: CONTRACTS }, ...config };
  }

  private readonly concurrencyConfig: ConcurrencyConfig;
}