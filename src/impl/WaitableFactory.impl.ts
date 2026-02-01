import { RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { Config as WaitableConfig, Waitable } from "@jonloucks/concurrency-ts/api/Waitable";
import { WaitableFactory } from "@jonloucks/concurrency-ts/api/WaitableFactory";
import { Config as ConcurrencyConfig, Contracts } from "@jonloucks/concurrency-ts/api/Concurrency";

import { create as createWaitableImpl } from "./Waitable.impl";
import { Internal } from "./Internal.impl";

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
  createWaitable<T>(config?: WaitableConfig<T>): RequiredType<Waitable<T>> {
    const validConfig = config ?? {};
    const contracts: Contracts = Internal.resolveContracts(validConfig, this._concurrencyConfig);
    const finalConfig: WaitableConfig<T> = { ...validConfig, contracts: contracts };
    return createWaitableImpl(finalConfig);
  }

  static internalCreate(config: ConcurrencyConfig): WaitableFactory {
    return new WaitableFactoryImpl(config);
  }

  private constructor(config: ConcurrencyConfig) {
    const contracts: Contracts = Internal.resolveContracts(config);
    this._concurrencyConfig = { ...config, contracts: contracts };
  }
  
  private readonly _concurrencyConfig: ConcurrencyConfig;
};