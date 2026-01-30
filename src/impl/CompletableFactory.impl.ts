import { CompletableFactory } from "@jonloucks/concurrency-ts/api/CompletableFactory";
import { Completable, Config as CompletableConfig} from "@jonloucks/concurrency-ts/api/Completable";
import { Config as ConcurrencyConfig } from "@jonloucks/concurrency-ts/api/Concurrency";

import { create as createCompletableImpl } from "./Completable.impl";

/** 
 * Create a new CompletableFactory
 *
 * @return the new CompletableFactory
 */
export function create(config: ConcurrencyConfig): CompletableFactory {
  return CompletableFactoryImpl.internalCreate(config);
}

// ---- Implementation details below ----

class CompletableFactoryImpl implements CompletableFactory {
  createCompletable<T>(config: CompletableConfig<T>): Completable<T> {
    const combinedConfig = { ...{ contracts: this.concurrencyConfig.contracts }, ...config };

    return createCompletableImpl<T>(combinedConfig);
  }

  static internalCreate(config: ConcurrencyConfig): CompletableFactory {
    return new CompletableFactoryImpl(config);
  }

  private constructor(config: ConcurrencyConfig) {
    this.concurrencyConfig = config;  
  }
  private readonly concurrencyConfig: ConcurrencyConfig;
};