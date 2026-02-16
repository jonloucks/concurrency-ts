import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { StateMachineFactory } from "@jonloucks/concurrency-ts/api/StateMachineFactory";
import { StateMachine, Config as StateMachineConfig } from "@jonloucks/concurrency-ts/api/StateMachine";
import { RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { Config as ConcurrencyConfig } from "@jonloucks/concurrency-ts/api/Concurrency";
import { presentCheck } from "@jonloucks/concurrency-ts/auxiliary/Checks";

import { create as createStateMachineImpl } from "./StateMachine.impl.js";
import { Internal } from "./Internal.impl.js";

/**
 * Create a new StateMachineFactory
 *
 * @return the new StateMachineFactory
 */
export function create(config?: ConcurrencyConfig): StateMachineFactory {
  return StateMachineFactoryImpl.internalCreate(config);
}

// ---- Implementation details below ----

class StateMachineFactoryImpl implements StateMachineFactory {
  createStateMachine<T>(config: StateMachineConfig<T>): RequiredType<StateMachine<T>> {
    const validConfig: StateMachineConfig<T> = presentCheck(config, "Config must be present.");
    const contracts: Contracts = Internal.resolveContracts(validConfig, this.#concurrencyConfig);
    const finalConfig: StateMachineConfig<T> = { ...validConfig, contracts: contracts };
    return createStateMachineImpl(finalConfig);
  }

  static internalCreate(config?: ConcurrencyConfig): StateMachineFactory {
    return new StateMachineFactoryImpl(config);
  }

  private constructor(config?: ConcurrencyConfig) {
    const contracts: Contracts = Internal.resolveContracts(config);
    this.#concurrencyConfig = { ...config, contracts: contracts };
  }

  readonly #concurrencyConfig?: ConcurrencyConfig;
};

