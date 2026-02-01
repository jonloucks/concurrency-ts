import { CompletableFactory } from "@jonloucks/concurrency-ts/api/CompletableFactory";
import { Completable, Config as CompletableConfig} from "@jonloucks/concurrency-ts/api/Completable";
import { Config as ConcurrencyConfig, Contracts } from "@jonloucks/concurrency-ts/api/Concurrency";

import { create as createCompletableImpl } from "./Completable.impl";
import { Internal } from "./Internal.impl";

/** 
 * Create a new CompletableFactory
 *
 * @return the new CompletableFactory
 */
export function create(config?: ConcurrencyConfig): CompletableFactory {
  return CompletableFactoryImpl.internalCreate(config);
}

// ---- Implementation details below ----

class CompletableFactoryImpl implements CompletableFactory {
  
  createCompletable<T>(config?: CompletableConfig<T>): Completable<T> {
    const validConfig = config ?? {};
    const contracts: Contracts = Internal.resolveContracts(validConfig, this._concurrencyConfig);
    const finalConfig: ConcurrencyConfig = { ...this._concurrencyConfig, ...validConfig, contracts: contracts };
    return createCompletableImpl<T>(finalConfig)
  }

  static internalCreate(config?: ConcurrencyConfig): CompletableFactory {
    return new CompletableFactoryImpl(config);
  }

  private constructor(config?: ConcurrencyConfig) {
    const contracts: Contracts = Internal.resolveContracts(config);
    this._concurrencyConfig = { ...config, contracts: contracts };
  }
  private readonly _concurrencyConfig: ConcurrencyConfig;
};