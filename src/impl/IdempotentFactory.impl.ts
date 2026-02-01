import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { IdempotentFactory } from "@jonloucks/concurrency-ts/api/IdempotentFactory";
import { Idempotent, Config as IdempotentConfig } from "@jonloucks/concurrency-ts/api/Idempotent";
import { RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { Config as ConcurrencyConfig } from "@jonloucks/concurrency-ts/api/Concurrency";

import { create as createIdempotentImpl } from "./Idempotent.impl";
import { Internal } from "./Internal.impl";
import { configCheck } from "../auxiliary/Checks";
  
/**
 * Create a new IdempotentFactory
 *
 * @return the new IdempotentFactory
 */
export function create(config?: ConcurrencyConfig): IdempotentFactory {
  return IdempotentFactoryImpl.internalCreate(config);
}

// ---- Implementation details below ----

class IdempotentFactoryImpl implements IdempotentFactory {
  
  createIdempotent(config: IdempotentConfig): RequiredType<Idempotent> {
    const contracts: Contracts = Internal.resolveContracts(config, this._concurrencyConfig);
    const finalConfig: IdempotentConfig = { ...config, contracts: contracts };
    return createIdempotentImpl(finalConfig);
  }

  static internalCreate(config?: ConcurrencyConfig): IdempotentFactory {
    return new IdempotentFactoryImpl(config);
  }

  private constructor(config?: ConcurrencyConfig) {
    const validConfig: ConcurrencyConfig = configCheck(config); // internal use case
    const contracts: Contracts = Internal.resolveContracts(validConfig);
    this._concurrencyConfig = { ...validConfig, contracts: contracts };
  }

  private readonly _concurrencyConfig: ConcurrencyConfig;
};