import { StateMachineFactory } from "@jonloucks/concurrency-ts/api/StateMachineFactory";
import { StateMachine, Config as StateMachineConfig } from "@jonloucks/concurrency-ts/api/StateMachine";
import { RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { Config as ConcurrencyConfig } from "@jonloucks/concurrency-ts/api/Concurrency";

import { create as createStateMachineImpl } from "./StateMachine.impl";

/**
 * Create a new StateMachineFactory
 *
 * @return the new StateMachineFactory
 */
export function create(config: ConcurrencyConfig): StateMachineFactory {
  return StateMachineFactoryImpl.internalCreate(config);
}

// ---- Implementation details below ----

class StateMachineFactoryImpl implements StateMachineFactory {
  createStateMachine<T>(config: StateMachineConfig<T>): RequiredType<StateMachine<T>> {
    // const combinedConfig = { ...{ contracts: this.concurrencyConfig.contracts }, ...config };
    return createStateMachineImpl(config);
  }

  static internalCreate(config: ConcurrencyConfig): StateMachineFactory {
    return new StateMachineFactoryImpl(config);
  }

  private constructor(config: ConcurrencyConfig) {
    this.concurrencyConfig = config;
  }

  private readonly concurrencyConfig: ConcurrencyConfig;
};