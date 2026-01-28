import { WaitableFactory } from "@jonloucks/concurrency-ts/api/WaitableFactory";
import { Waitable, Config } from "@jonloucks/concurrency-ts/api/Waitable";
import { RequiredType } from "@jonloucks/concurrency-ts/api/Types";

import { create as createWaitableImpl } from "./WaitableImpl";

/**
 * Create a new WaitableFactory
 *
 * @return the new WaitableFactory
 */
export function create() : WaitableFactory {
  return WaitableFactoryImpl.internalCreate();
} 

// ---- Implementation details below ----

class WaitableFactoryImpl implements WaitableFactory {
  createWaitable<T>(config?: Config<T>): RequiredType<Waitable<T>> {
    return createWaitableImpl(config);
  }

  static internalCreate(): WaitableFactory {
    return new WaitableFactoryImpl();
  }

  private constructor() {
  }
};