import { Concurrency, CONTRACT as CONCURRENCY_CONTRACT, Config as ConcurrencyConfig } from "@jonloucks/concurrency-ts/api/Concurrency";
import { ConcurrencyFactory } from "@jonloucks/concurrency-ts/api/ConcurrencyFactory";

import { CONTRACT as COMPLETABLE_FACTORY } from "@jonloucks/concurrency-ts/api/CompletableFactory";
import { CONTRACT as STATE_MACHINE_FACTORY } from "@jonloucks/concurrency-ts/api/StateMachineFactory";
import { CONTRACT as WAITABLE_FACTORY } from "@jonloucks/concurrency-ts/api/WaitableFactory";

import { RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { Repository } from "@jonloucks/contracts-ts/api/Repository";
import { presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";

import { CONTRACT as PROMISOR_FACTORY_CONTRACT, PromisorFactory } from "@jonloucks/contracts-ts/api/PromisorFactory";
import { CONTRACT as REPOSITORY_FACTORY_CONTRACT, RepositoryFactory } from "@jonloucks/contracts-ts/api/RepositoryFactory";
import { create as createCompletableFactoryImpl } from "./CompletableFactory.impl";
import { create as createConcurrencyImpl } from "./Concurrency.impl";
import { wrap as wrapConcurrency } from "./ConcurrencyWrapper.impl";
import { Internal } from "./Internal.impl";
import { create as createStateMachineFactoryImpl } from "./StateMachineFactory.impl";
import { create as createWaitableFactoryImpl } from "./WaitableFactory.impl";
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
    const contracts: Contracts = Internal.resolveContracts(validConfig, this.#concurrencyConfig);
    const finalConfig: ConcurrencyConfig = { ...this.#concurrencyConfig, ...validConfig, contracts: contracts };
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
    const contracts: Contracts = Internal.resolveContracts(validConfig, this.#concurrencyConfig);
    const finalConfig: ConcurrencyConfig = { ...this.#concurrencyConfig, ...validConfig, contracts: contracts };
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
    this.#concurrencyConfig = { ...config, contracts: contracts };
  }

  private installKernel(repository: RequiredType<Repository>, config: ConcurrencyConfig): void {
    repository.keep(WAITABLE_FACTORY, createWaitableFactoryImpl(config));
    repository.keep(STATE_MACHINE_FACTORY, createStateMachineFactoryImpl(config));
    repository.keep(COMPLETABLE_FACTORY, createCompletableFactoryImpl(config));
  }

  readonly #concurrencyConfig: ConcurrencyConfig;
}

