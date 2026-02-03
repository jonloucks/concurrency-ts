import { Completable, CompletableConfig, Concurrency, OnCompletion, StateMachine, StateMachineConfig, Waitable, WaitableConfig } from "@jonloucks/concurrency-ts/api/Concurrency";
import { AutoClose, inlineAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { Repository } from "@jonloucks/contracts-ts/api/Repository";
import { ConsumerType, OptionalType, RequiredType, SupplierType } from "@jonloucks/concurrency-ts/api/Types";

/**
 * Wrapper method to create a Concurrency wrapper which is responsible for managing
 * the lifecycle of the underlying Repository and Concurrency instances.
 * 
 * @param concurrency the underlying Concurrency instance
 * @param repository the underlying Repository instance
 * @returns the Concurrency implementation
 */
export function wrap(concurrency: RequiredType<Concurrency>, repository: RequiredType<Repository>): Concurrency {
  return ConcurrencyWrapper.internalCreate(concurrency, repository);
}

// ---- Implementation details below ----

/**
 * The Concurrency wrapper implementation
 * Concurrency wrapper which is responsible for managing
 * the lifecycle of the underlying Repository and Concurrency instances.
 */
class ConcurrencyWrapper implements Concurrency {

  static internalCreate(concurrency: RequiredType<Concurrency>, repository: RequiredType<Repository>): Concurrency {
    return new ConcurrencyWrapper(concurrency, repository);
  }

  autoOpen(): AutoClose {
    // what if referrent also has autoOpen?
    // maybe we detect that and chain them?
    return this.open();
  }

  open(): AutoClose {
    const closeRepository: AutoClose = this.#repository.open();
    try {
      const closeConcurrency: AutoClose = this.#concurrency.open();
      return inlineAutoClose(() => {
        try {
          closeConcurrency.close(); 
        } finally {
          closeRepository.close(); // ensure repository is closed
        }
      });
    } catch (thrown) {
      closeRepository.close();
      throw thrown
    }
  }

  createWaitable<T>(config: WaitableConfig<T>): RequiredType<Waitable<T>> {
    return this.#concurrency.createWaitable(config);
  }

  createStateMachine<T>(config: StateMachineConfig<T>): RequiredType<StateMachine<T>> {
    return this.#concurrency.createStateMachine(config);
  }

  createCompletable<T>(config: CompletableConfig<T>): RequiredType<Completable<T>> {
    return this.#concurrency.createCompletable(config);
  }

  completeLater<T>(onCompletion: RequiredType<OnCompletion<T>>, delegate: RequiredType<ConsumerType<OnCompletion<T>>>): void {
    return this.#concurrency.completeLater(onCompletion, delegate);
  }

  completeNow<T>(onCompletion: RequiredType<OnCompletion<T>>, successBlock: RequiredType<SupplierType<T>>): OptionalType<T> {
    return this.#concurrency.completeNow(onCompletion, successBlock);
  }

  toString(): string {
    return this.#concurrency.toString();
  }

  private constructor(concurrency: RequiredType<Concurrency>, repository: RequiredType<Repository>) {
    this.#concurrency = concurrency;
    this.#repository = repository;
  }

  readonly #concurrency: RequiredType<Concurrency>;
  readonly #repository: RequiredType<Repository>;
};