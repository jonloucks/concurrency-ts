import { StateMachineFactory } from "@jonloucks/concurrency-ts/api/StateMachineFactory";
import { StateMachine, Config } from "@jonloucks/concurrency-ts/api/StateMachine";
import { RequiredType } from "@jonloucks/concurrency-ts/api/Types";

import { create as createStateMachineImpl } from "./StateMachine.impl";

/**
 * Create a new StateMachineFactory
 *
 * @return the new StateMachineFactory
 */
export function create(): StateMachineFactory {
  return StateMachineFactoryImpl.internalCreate();
}

// ---- Implementation details below ----

class StateMachineFactoryImpl implements StateMachineFactory {
  createStateMachine<T>(config: Config<T>): RequiredType<StateMachine<T>> {
    return createStateMachineImpl(config);
  }

  static internalCreate(): StateMachineFactory {
    return new StateMachineFactoryImpl();
  }

  private constructor() {
  }
};