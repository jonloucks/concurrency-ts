import { RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { Config, Waitable } from "@jonloucks/concurrency-ts/api/Waitable";
import { WaitableFactory } from "@jonloucks/concurrency-ts/api/WaitableFactory";
import { Config as ConcurrencyConfig } from "@jonloucks/concurrency-ts/api/Concurrency";

import { create as createWaitableImpl } from "./Waitable.impl";

/**
 * Create a new WaitableFactory
 *
 * @return the new WaitableFactory
 */
export function create(config: ConcurrencyConfig): WaitableFactory {
  return WaitableFactoryImpl.internalCreate(config);
} 

// ---- Implementation details below ----

class WaitableFactoryImpl implements WaitableFactory {
  createWaitable<T>(config?: Config<T>): RequiredType<Waitable<T>> {
    const combinedConfig : Config<T> = { contracts: this._concurrencyConfig.contracts!, ...(config ?? {}) };
    return createWaitableImpl(combinedConfig);
  }

  static internalCreate(config: ConcurrencyConfig): WaitableFactory {
    return new WaitableFactoryImpl(config);
  }

  private constructor(config: ConcurrencyConfig) {
    this._concurrencyConfig = config;
  }
  
  private readonly _concurrencyConfig: ConcurrencyConfig;
};