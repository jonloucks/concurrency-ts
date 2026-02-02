import { ConcurrencyFactory } from "@jonloucks/concurrency-ts/api/ConcurrencyFactory";
import { Concurrency, Config as ConcurrencyConfig, CONTRACT as CONCURRENCY_CONTRACT } from "@jonloucks/concurrency-ts/api/Concurrency";

import { CONTRACT as WAITABLE_FACTORY } from "@jonloucks/concurrency-ts/api/WaitableFactory";
import { CONTRACT as STATE_MACHINE_FACTORY } from "@jonloucks/concurrency-ts/api/StateMachineFactory";
import { CONTRACT as COMPLETABLE_FACTORY } from "@jonloucks/concurrency-ts/api/CompletableFactory";
import { CONTRACT as IDEMPOTENT_FACTORY } from "@jonloucks/concurrency-ts/api/IdempotentFactory";

import { RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { Repository } from "@jonloucks/contracts-ts/api/Repository";
import { presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";

import { create as createConcurrencyImpl } from "./Concurrency.impl";
import { create as createWaitableFactoryImpl } from "./WaitableFactory.impl";
import { create as createStateMachineFactoryImpl } from "./StateMachineFactory.impl";
import { create as createCompletableFactoryImpl } from "./CompletableFactory.impl";
import { create as createIdempotentFactoryImpl } from "./IdempotentFactory.impl";
import { Internal } from "./Internal.impl";
import { PromisorFactory, CONTRACT as PROMISOR_FACTORY_CONTRACT } from "@jonloucks/contracts-ts/api/PromisorFactory";
import { RepositoryFactory, CONTRACT as REPOSITORY_FACTORY_CONTRACT } from "@jonloucks/contracts-ts/api/RepositoryFactory";
import { wrap as wrapConcurrency } from "./ConcurrencyWrapper.impl";
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
    const repositoryFactory: RepositoryFactory = contracts.enforce(REPOSITORY_FACTORY_CONTRACT);
    const repository: Repository = repositoryFactory.createRepository();

    this.installKernel(repository, finalConfig);

    // how to bind promisors before creation?
    // if we open the repository before creation, we risk unexpected behavior.
    // for example, if open is never called, there will be residual bindings.
    return wrapConcurrency(createConcurrencyImpl(finalConfig), repository);
  }

  install(repository: RequiredType<Repository>, config?: ConcurrencyConfig): void {
    // potential unexpected behavior might occur when merging configs
    const validConfig = config ?? {};
    const contracts: Contracts = Internal.resolveContracts(validConfig, this._concurrencyConfig);
    const finalConfig: ConcurrencyConfig = { ...this._concurrencyConfig, ...validConfig, contracts: contracts };
    const validRepository: RequiredType<Repository> = presentCheck(repository, "Repository must be present.");
    const promisorFactory: PromisorFactory = contracts.enforce(PROMISOR_FACTORY_CONTRACT);

    this.installKernel(validRepository, finalConfig);

    validRepository.keep(CONCURRENCY_CONTRACT, promisorFactory.createLifeCycle(() => createConcurrencyImpl(finalConfig)));
  }

  static internalCreate(config: ConcurrencyConfig): ConcurrencyFactory {
    return new ConcurrencyFactoryImpl(config);
  }

  private constructor(config: ConcurrencyConfig) {
    const contracts: Contracts = Internal.resolveContracts(config);
    this._concurrencyConfig = { ...config, contracts: contracts };
  }

  private installKernel(repository: RequiredType<Repository>, config: ConcurrencyConfig): void {
    repository.keep(WAITABLE_FACTORY, createWaitableFactoryImpl(config));
    repository.keep(STATE_MACHINE_FACTORY, createStateMachineFactoryImpl(config));
    repository.keep(COMPLETABLE_FACTORY, createCompletableFactoryImpl(config));
    repository.keep(IDEMPOTENT_FACTORY, createIdempotentFactoryImpl(config));
  }

  private readonly _concurrencyConfig: ConcurrencyConfig;
}

