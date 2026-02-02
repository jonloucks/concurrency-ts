import { Completable, Config } from "@jonloucks/concurrency-ts/api/Completable";
import { Completion, CompletionState } from "@jonloucks/concurrency-ts/api/Completion";
import { getStateMachineConfig as getCompletionStateConfig } from "@jonloucks/concurrency-ts/api/CompletionState";
import { Idempotent } from "@jonloucks/contracts-ts/auxiliary/Idempotent";
import { OnCompletion } from "@jonloucks/concurrency-ts/api/OnCompletion";
import { StateMachine } from "@jonloucks/concurrency-ts/api/StateMachine";
import { Waitable } from "@jonloucks/concurrency-ts/api/Waitable";
import { WaitableNotify } from "@jonloucks/concurrency-ts/api/WaitableNotify";
import { completionCheck, onCompletionCheck } from "@jonloucks/concurrency-ts/auxiliary/Checks";
import { AUTO_CLOSE_FACTORY, AutoClose, AutoCloseFactory, Contracts, isPresent, OptionalType } from "@jonloucks/contracts-ts";
import { AutoCloseMany, Close, inlineAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { contractsCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { AtomicBoolean, createAtomicBoolean } from "@jonloucks/contracts-ts/auxiliary/Convenience";
import { IllegalStateException } from "@jonloucks/contracts-ts/auxiliary/IllegalStateException";
import { createIdempotent } from "@jonloucks/contracts-ts/auxiliary/Convenience"

import { create as createStateMachine } from "./StateMachine.impl";
import { create as createWaitable } from "./Waitable.impl";

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
    return this._idempotent.open();
  }

  notifyState(): WaitableNotify<CompletionState> {
    return this._completionStateMachine;
  }

  notifyValue(): WaitableNotify<T> {
    return this._waitableValue;
  }

  getCompletion(): OptionalType<Completion<T>> {
    return this._completion;
  }

  notify(onCompletion: OnCompletion<T>): AutoClose {
    const referentOnCompletion: OnCompletion<T> = onCompletionCheck(onCompletion);
    const firstClose: AtomicBoolean = createAtomicBoolean(true);
    const isLive: AtomicBoolean = createAtomicBoolean(true);

    const removeObserver = (v: Observer<T>): void => {
      this._observers.delete(v);
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
    this._observers.add(observer);

    if (isPresent(this._completion)) {
      try {
        observer.onCompletion(this._completion!);
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

    if (this._completionStateMachine.setState("onCompletion", validCompletion.state)) {
      this._completion = validCompletion;

      const value = validCompletion.value;
      if (this.isCompleted() && isPresent(value)) {
        this._waitableValue.consume(value!);
      }
      this.notifyObservers(validCompletion);
    }
  }

  isCompleted(): boolean {
    return this._completionStateMachine.isCompleted();
  }

  private realOpen(): AutoClose {
    this._closeMany.add(this._waitableValue.open());
    this._closeMany.add(this._completionStateMachine.open());
    return inlineAutoClose((): void => {
      this._closeMany.close();
    });
  }

  private notifyObservers(newValue: Completion<T>): void {
    for (const observer of this._observers) {
      observer.onCompletion(newValue);
    }
  }

  private assertNotRejecting(): void {
    switch (this._idempotent.getState()) {
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
    this._closeMany = closeFactory.createAutoCloseMany();
    this._waitableValue = createWaitable<T>({ contracts: contracts, initialValue: config.initialValue });
    this._idempotent = createIdempotent({ contracts: contracts, open: () => this.realOpen() });
    this._completionStateMachine = createStateMachine(getCompletionStateConfig());
  }

  private readonly _completionStateMachine: StateMachine<CompletionState>;
  private readonly _idempotent: Idempotent;
  private _completion: OptionalType<Completion<T>> = null;
  private readonly _waitableValue: Waitable<T>;
  private readonly _closeMany: AutoCloseMany;
  private readonly _observers: Set<Observer<T>> = new Set<Observer<T>>();
};