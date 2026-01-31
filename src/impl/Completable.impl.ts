import { Completable, Config } from "@jonloucks/concurrency-ts/api/Completable";
import { Completion, CompletionState } from "@jonloucks/concurrency-ts/api/Completion";
import { getStateMachineConfig as getCompletionStateConfig } from "@jonloucks/concurrency-ts/api/CompletionState";
import { OnCompletion } from "@jonloucks/concurrency-ts/api/OnCompletion";
import { Waitable } from "@jonloucks/concurrency-ts/api/Waitable";
import { WaitableNotify } from "@jonloucks/concurrency-ts/api/WaitableNotify";
import { StateMachine } from "@jonloucks/concurrency-ts/api/StateMachine";
import { AUTO_CLOSE_FACTORY, AutoClose, AutoCloseFactory, Contracts, isPresent, OptionalType } from "@jonloucks/contracts-ts";
import { Idempotent } from "@jonloucks/concurrency-ts/api/Idempotent";
import { contractsCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { AutoCloseMany, Close, inlineAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { completionCheck, onCompletionCheck } from "@jonloucks/concurrency-ts/auxiliary/Checks";
import { AtomicBoolean, createAtomicBoolean } from "@jonloucks/contracts-ts/auxiliary/Convenience";
import { IllegalStateException } from "@jonloucks/contracts-ts/auxiliary/IllegalStateException";

import { create as createStateMachine } from "./StateMachine.impl";
import { create as createWaitable } from "./Waitable.impl";
import { create as createIdempotent } from "./Idempotent.impl";

/** 
 * Create a new Completable
 *
 * @param config the completable configuration
 * @return the new Completable
 * @param <T> the type of completion value
 */
export function create<T>(config: Config<T>): Completable<T> {
  return CompletableImpl.internalCreate(config);
}

// ---- Implementation details below ----

interface Observer<T> extends OnCompletion<T>, Close {
};

class CompletableImpl<T> implements Completable<T> {
  open(): AutoClose {
    return this.idempotent.open();
  }

  notifyState(): WaitableNotify<CompletionState> {
    return this.completionStateMachine;
  }

  notifyValue(): WaitableNotify<T> {
    return this.waitableValue;
  }

  getCompletion(): OptionalType<Completion<T>> {
    return this.completion;
  }

  notify(onCompletion: OnCompletion<T>): AutoClose {
    const referentOnCompletion: OnCompletion<T> = onCompletionCheck(onCompletion);
    const firstClose: AtomicBoolean = createAtomicBoolean(true);
    const isLive: AtomicBoolean = createAtomicBoolean(true);

    const removeObserver = (v: Observer<T>): void => {
      this.observers.delete(v);
    };
    const observer: Observer<T> = {
      onCompletion: function (completion: Completion<T>): void {
        if (isLive.get()) {
          referentOnCompletion.onCompletion(completion);
        }
      },
      close: function (): void {
        if (firstClose.compareAndSet(true, false)) {
          isLive.set(false);
          removeObserver(this);
        }
      }
    };
    this.observers.add(observer);

    if (isPresent(this.completion)) {
      try {
        observer.onCompletion(this.completion!);
      } catch (e) {
        removeObserver(observer);
        throw e;
      }
    }

    return inlineAutoClose((): void => {
      observer.close();
    });
  }

  onCompletion(completion: Completion<T>): void {
    const validCompletion: Completion<T> = completionCheck(completion);

    this.assertNotRejecting();

    if (this.completionStateMachine.setState("onCompletion", validCompletion.getState())) {
      this.completion = validCompletion;

      const value = validCompletion.getValue();
      if (this.isCompleted() && isPresent(value)) {
        this.waitableValue.consume(value!);
      }
      this.notifyObservers(validCompletion);
    }
  }

  isCompleted(): boolean {
    return this.completionStateMachine.isCompleted();
  }

  private realOpen(): AutoClose {
    this.closeMany.add(this.waitableValue.open());
    this.closeMany.add(this.completionStateMachine.open());
    return inlineAutoClose((): void => {
      this.closeMany.close();
    });
  }

  private notifyObservers(newValue: Completion<T>): void {
    for (const observer of this.observers) {
      observer.onCompletion(newValue);
    }
  }

  private assertNotRejecting(): void {
    switch (this.idempotent.getState()) {
      case 'OPENABLE':
      case 'DESTROYED':
      case 'CLOSED':
        throw new IllegalStateException("Completable is rejecting.");
    }
  }

  static internalCreate<T>(config: Config<T>): Completable<T> {
    return new CompletableImpl<T>(config);
  }

  private constructor(config: Config<T>) {
    const contracts: Contracts = contractsCheck(config.contracts);
    const closeFactory: AutoCloseFactory = contracts.enforce(AUTO_CLOSE_FACTORY);
    this.closeMany = closeFactory.createAutoCloseMany();
    this.waitableValue = createWaitable<T>({ contracts: contracts, initialValue: config.initialValue });
    this.idempotent = createIdempotent({ contracts: contracts, open: () => this.realOpen() });
    this.completionStateMachine = createStateMachine(getCompletionStateConfig());
  }

  private readonly completionStateMachine: StateMachine<CompletionState>;
  private readonly idempotent: Idempotent;
  private completion: OptionalType<Completion<T>> = null;
  private readonly waitableValue: Waitable<T>;
  private readonly closeMany: AutoCloseMany;
  private readonly observers: Set<Observer<T>> = new Set<Observer<T>>();
};