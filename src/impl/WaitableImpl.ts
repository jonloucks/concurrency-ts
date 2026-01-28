import { ConcurrencyException } from "@jonloucks/concurrency-ts/api/ConcurrencyException";
import { Duration, OptionalType, RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { Config, Waitable } from "@jonloucks/concurrency-ts/api/Waitable";
import { Consumer, fromType as consumerFromType, Type as ConsumerType } from "@jonloucks/concurrency-ts/auxiliary/Consumer";
import { Predicate, fromType as predicateFromType, Type as PredicateType } from "@jonloucks/concurrency-ts/auxiliary/Predicate";
import { Supplier, fromType as supplierFromType, Type as SupplierType } from "@jonloucks/concurrency-ts/auxiliary/Supplier";
import { AutoClose } from "@jonloucks/contracts-ts";
import { AtomicBoolean, AtomicReference, createAtomicBoolean, createAtomicReference } from "@jonloucks/contracts-ts/auxiliary/Convenience";
import { IllegalStateException } from "@jonloucks/contracts-ts/auxiliary/IllegalStateException";

import { AUTO_CLOSE_NONE, Close, inlineAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { ExposedPromise } from "./ExposedPromise";
import { create as createExposedPromise } from "./ExposedPromiseImpl";
import { Internal } from "./Internal.impl";

/**
 * Create a new Waitable
 *
 * @return the new Waitable
 */
export function create<T>(config?: RequiredType<Config<T>>): Waitable<T> {
  return WaitableImpl.internalCreate(config);
}

// ---- Implementation details below ----

interface ValueObserver<T> extends Close {
  observeValue(value: OptionalType<T>): void;
};

const CLOSED_EXCEPTION: ConcurrencyException = new ConcurrencyException("Waitable is closed.");

class WaitableImpl<T> implements Waitable<T> {

  open(): AutoClose {
    if (this._isOpen.compareAndSet(false, true)) {
      return inlineAutoClose((): void => {
        if (this._isOpen.compareAndSet(true, false)) {
          this.closeAllListeners();
        }
      });
    } else {
      return AUTO_CLOSE_NONE;
    }
  };

  // WaitableSupplier.supply implementations
  supply(): T {
    const value = this._reference.get();
    if (value === undefined || value === null) {
      throw new IllegalStateException("No value is currently available in Waitable.");
    }
    return value;
  }

  // WaitableSupplier.supplyIf implementation
  supplyIf(predicate: PredicateType<T>): OptionalType<T> {
    const validPredicate: Predicate<OptionalType<T>> = predicateFromType(predicate);
    const currentValue: OptionalType<T> = this._reference.get();
    if (validPredicate.test(currentValue)) {
      return currentValue;
    } else {
      return undefined;
    }
  }

  // WaitableSupplier.supplyWhen implementation
  async supplyWhen(predicate: RequiredType<PredicateType<T>>, timeout?: Duration): Promise<OptionalType<T>> {
    if (!this.isOpen()) {
      return Promise.reject(CLOSED_EXCEPTION);
    }

    const validPredicate: Predicate<OptionalType<T>> = predicateFromType(predicate);
    const firstNotify: AtomicBoolean = createAtomicBoolean(true);
    const exposedPromise: ExposedPromise<OptionalType<T>> = createExposedPromise();
    const removeListener = (v : ValueObserver<T>): void => {
      this._valueObservers.delete(v);
    };

    const valueObserver: ValueObserver<T> = {
      observeValue: function (value: T): void {
        if (validPredicate.test(value) && firstNotify.getAndSet(false)) {
          removeListener(this);
          exposedPromise.resolve(value);
        }
      },
      close: function (): void {
        removeListener(this);
        exposedPromise.reject(CLOSED_EXCEPTION);
      }
    };

    // maybe have the timeout delete the observer as well

    const returnPromise: Promise<OptionalType<T>> = Internal.wrapPromiseWithTimeout<OptionalType<T>>(
      exposedPromise.getPromise(),
      timeout
    );

    this._valueObservers.add(valueObserver);
    valueObserver.observeValue(this.supply());
    return returnPromise;
  }

  // WaitableConsumer.consume implementations
  consume(value: SupplierType<T>): void {
    this.setValue(supplierFromType(value).supply());
  }

  // WaitableConsumer.consumeIf implementation
  consumeIf(predicate: RequiredType<PredicateType<T>>, value: SupplierType<T>): OptionalType<T> {
    const validPredicate: Predicate<OptionalType<T>> = predicateFromType(predicate);
    const validValueSupplier: Supplier<T> = supplierFromType(value);
    const currentValue: OptionalType<T> = this._reference.get();
    if (validPredicate.test(currentValue)) {
      const newValue: T = validValueSupplier.supply();
      this.setValue(newValue);
      return newValue;
    } else {
      return undefined;
    }
  }

  // WaitableConsumer.consumeWhen implementation
  async consumeWhen(predicate: RequiredType<PredicateType<T>>, value: SupplierType<T>, timeout?: Duration): Promise<OptionalType<T>> {
    if (!this.isOpen()) {
      return Promise.reject(CLOSED_EXCEPTION);
    }

    const validPredicate: Predicate<OptionalType<T>> = predicateFromType(predicate);
    const validValueSupplier: Supplier<T> = supplierFromType(value);
    const firstNotify: AtomicBoolean = createAtomicBoolean(true);
    const exposedPromise: ExposedPromise<OptionalType<T>> = createExposedPromise();
    const removeListener = (v : ValueObserver<T>): void => {
      this._valueObservers.delete(v);
    };
    const setTheValue : (T : OptionalType<T>) => void = (v : OptionalType<T>) : void => {
      this.setValue(v);
    };

    const valueObserver: ValueObserver<T> = {
      observeValue: function (value: T): void {
        if (validPredicate.test(value) && firstNotify.getAndSet(false)) {
          const suppliedValue: OptionalType<T> = validValueSupplier.supply();
          setTheValue(suppliedValue);
          // what to do about unexpected use
          removeListener(this);
          exposedPromise.resolve(suppliedValue);
        }
      },
      close: function (): void {
        removeListener(this);
        exposedPromise.reject(CLOSED_EXCEPTION);
      }
    };

    const returnPromise: Promise<OptionalType<T>> = Internal.wrapPromiseWithTimeout<OptionalType<T>>(
      exposedPromise.getPromise(),
      timeout
    );

    this._valueObservers.add(valueObserver);
    valueObserver.observeValue(this.supply());

    return returnPromise;
  }

  // WaitableNotify.notifyWhile implementation
  notifyWhile(predicate: RequiredType<PredicateType<T>>, listener: RequiredType<ConsumerType<T>>): RequiredType<AutoClose> {
    this.assertOpen();

    const validPredicate: Predicate<OptionalType<T>> = predicateFromType(predicate);
    const notifyCallback: Consumer<T> = consumerFromType(listener);
    const firstClose: AtomicBoolean = createAtomicBoolean(true);
    const removeListener = (v : ValueObserver<T>): void => {
      this._valueObservers.delete(v);
    };
    // Guard against re-entrant notifications from notifyCallback changing the value.
    let notifying = false;
    let pendingValue: OptionalType<T> | undefined;

    const valueObserver: ValueObserver<T> = {
      observeValue: function (value: T): void {
        if (!validPredicate.test(value)) {
          return;
        }

        // If a notification is already in progress for this observer, coalesce
        // subsequent value changes and process the latest one after the current
        // callback completes to avoid unbounded recursion.
        if (notifying) {
          pendingValue = value;
          return;
        }

        notifying = true;
        try {
          let current: OptionalType<T> | undefined = value;
          // Process the initial value and any values observed during callbacks.
          while (current !== undefined && validPredicate.test(current)) {
            notifyCallback.consume(current);

            if (pendingValue === undefined) {
              break;
            }

            current = pendingValue;
            pendingValue = undefined;
          }
        } finally {
          notifying = false;
        }
      },
      close: function (): void {
        if (firstClose.compareAndSet(true, false)) {
          removeListener(this);
        }
      }
    };

    this._valueObservers.add(valueObserver);
    valueObserver.observeValue(this.supply());
    return inlineAutoClose((): void => {
      valueObserver.close();
    });
  }

  static internalCreate<T>(config?: RequiredType<Config<T>>): RequiredType<Waitable<T>> {
    return new WaitableImpl(config);
  }

  private constructor(config?: RequiredType<Config<T>>) {
    const actualConfig = config ? config : {};

    this._reference = createAtomicReference<OptionalType<T>>(actualConfig.initialValue)
  }

  private isOpen(): boolean {
    return this._isOpen.get();
  }

  private setValue(newValue: OptionalType<T>): void {
    const oldValue: OptionalType<T> = this._reference.getAndSet(newValue);
    if (oldValue !== newValue) {
      this.notifyListeners(newValue);
    }
  }

  private notifyListeners(newValue: OptionalType<T>): void {
    for (const valueObserver of this._valueObservers) {
      valueObserver.observeValue(newValue);
    }
  }

  private closeAllListeners(): void {
    for (const valueObserver of this._valueObservers) {
      valueObserver.close();
    }
  }

  private assertOpen(): void {
    if (!this._isOpen.get()) {
      throw new IllegalStateException("Waitable must be open.");
    }
  }

  private readonly _isOpen: AtomicBoolean = createAtomicBoolean(false)
  private readonly _reference: AtomicReference<OptionalType<T>>;
  private readonly _valueObservers: Set<ValueObserver<unknown>> = new Set<ValueObserver<unknown>>();
}