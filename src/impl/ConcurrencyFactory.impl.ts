import { ConcurrencyFactory } from "@jonloucks/concurrency-ts/api/ConcurrencyFactory";
import { Concurrency, Config as ConcurrencyConfig } from "@jonloucks/concurrency-ts/api/Concurrency";

import { CONTRACT as WAITABLE_FACTORY } from "@jonloucks/concurrency-ts/api/WaitableFactory";
import { CONTRACT as STATE_MACHINE_FACTORY } from "@jonloucks/concurrency-ts/api/StateMachineFactory";
import { CONTRACT as COMPLETABLE_FACTORY } from "@jonloucks/concurrency-ts/api/CompletableFactory";
import { CONTRACT as IDEMPOTENT_FACTORY } from "@jonloucks/concurrency-ts/api/IdempotentFactory";

import { RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { Contracts, Repository } from "@jonloucks/contracts-ts";
import { presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";

import { create as createConcurrencyImpl } from "./Concurrency.impl";
import { create as createWaitableFactoryImpl } from "./WaitableFactory.impl";
import { create as createStateMachineFactoryImpl } from "./StateMachineFactory.impl";
import { create as createCompletableFactoryImpl } from "./CompletableFactory.impl";
import { create as createIdempotentFactoryImpl } from "./IdempotentFactory.impl";
import { Internal } from "./Internal.impl";

/** 
 * Create a new ConcurrencyFactory
 * @param config the Concurrency Config
 *
 * @return the new ConcurrencyFactory
 */
export function create(config?: ConcurrencyConfig): ConcurrencyFactory {
  return ConcurrencyFactoryImpl.internalCreate(config ?? {});
}

// ---- Implementation details below ----

class ConcurrencyFactoryImpl implements ConcurrencyFactory {

  createConcurrency(config?: ConcurrencyConfig): Concurrency {
    const validConfig = config ?? {};
    const contracts: Contracts = Internal.resolveContracts(validConfig, this._concurrencyConfig);
    const finalConfig: ConcurrencyConfig = { ...this._concurrencyConfig, ...validConfig, contracts: contracts };

    // temporary installation of factories to create Concurrency
    contracts.bind(WAITABLE_FACTORY, createWaitableFactoryImpl(finalConfig), "IF_NOT_BOUND");
    contracts.bind(STATE_MACHINE_FACTORY, createStateMachineFactoryImpl(finalConfig), "IF_NOT_BOUND");
    contracts.bind(COMPLETABLE_FACTORY, createCompletableFactoryImpl(finalConfig), "IF_NOT_BOUND");
    contracts.bind(IDEMPOTENT_FACTORY, createIdempotentFactoryImpl(finalConfig), "IF_NOT_BOUND");

    return createConcurrencyImpl(finalConfig);
  }

  install(repository: RequiredType<Repository>, config?: ConcurrencyConfig): void {
    // potential unexpected behavior might occur when merging configs
    const validConfig = config ?? {};
    const contracts: Contracts = Internal.resolveContracts(validConfig, this._concurrencyConfig);
    const finalConfig: ConcurrencyConfig = { ...this._concurrencyConfig, ...validConfig, contracts: contracts };
    const validRepository: RequiredType<Repository> = presentCheck(repository, "Repository must be present.");

    validRepository.keep(WAITABLE_FACTORY, createWaitableFactoryImpl(finalConfig));
    validRepository.keep(STATE_MACHINE_FACTORY, createStateMachineFactoryImpl(finalConfig));
    validRepository.keep(COMPLETABLE_FACTORY, createCompletableFactoryImpl(finalConfig));
    validRepository.keep(IDEMPOTENT_FACTORY, createIdempotentFactoryImpl(finalConfig));
  }

  static internalCreate(config: ConcurrencyConfig): ConcurrencyFactory {
    return new ConcurrencyFactoryImpl(config);
  }

  private constructor(config: ConcurrencyConfig) {
    const contracts: Contracts = Internal.resolveContracts(config);
    this._concurrencyConfig = { ...config, contracts: contracts };
  }

  private readonly _concurrencyConfig: ConcurrencyConfig;
}