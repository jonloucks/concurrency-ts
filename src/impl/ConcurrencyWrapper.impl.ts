import { Completable, CompletableConfig, Concurrency, OnCompletion, StateMachine, StateMachineConfig, Waitable, WaitableConfig } from "@jonloucks/concurrency-ts/api/Concurrency";
import { AutoClose, inlineAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { Repository } from "@jonloucks/contracts-ts/api/Repository";
import { ConsumerType, OptionalType, RequiredType, SupplierType } from "@jonloucks/concurrency-ts/api/Types";
import { Open } from "@jonloucks/contracts-ts/api/Open";

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
    return this.open();
  }

  open(): AutoClose {
    const closeConcurrency: AutoClose = this.concurrency.open();
    const thisRepository = this.repository;

    let opener: Open = {
      open() {
        try {
          return thisRepository.open();
        } catch (error) {
          closeConcurrency.close(); // if the repository fails to open, close the concurrency
          throw error;
        }
      }
    };

    const closeRepository: AutoClose = opener.open();
    return inlineAutoClose(() => {
      try {
        closeRepository.close();
      } finally {
        closeConcurrency.close(); // ensure concurrency are closed even if repository close fails
      }
    });
  }

  createWaitable<T>(config: WaitableConfig<T>): RequiredType<Waitable<T>> {
    return this.concurrency.createWaitable(config);
  }

  createStateMachine<T>(config: StateMachineConfig<T>): RequiredType<StateMachine<T>> {
    return this.concurrency.createStateMachine(config);
  }

  createCompletable<T>(config: CompletableConfig<T>): RequiredType<Completable<T>> {
    return this.concurrency.createCompletable(config);
  }

  completeLater<T>(onCompletion: RequiredType<OnCompletion<T>>, delegate: RequiredType<ConsumerType<OnCompletion<T>>>): void {
    return this.concurrency.completeLater(onCompletion, delegate);
  }
  
  completeNow<T>(onCompletion: RequiredType<OnCompletion<T>>, successBlock: RequiredType<SupplierType<T>>): OptionalType<T> {
    return this.concurrency.completeNow(onCompletion, successBlock);
  }

  toString(): string {
    return this.concurrency.toString();
  }

  private constructor(concurrency: RequiredType<Concurrency>, repository: RequiredType<Repository>) {
    this.concurrency = concurrency;
    this.repository = repository;
  }

  private readonly concurrency: RequiredType<Concurrency>;
  private readonly repository: RequiredType<Repository>;
};