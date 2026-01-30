import { Completable, Config } from "@jonloucks/concurrency-ts/api/Completable";
import { Completion, CompletionState } from "@jonloucks/concurrency-ts/api/Completion";
import { getStateMachineConfig as getCompletionStateConfig } from "@jonloucks/concurrency-ts/api/CompletionState";
import { OnCompletion } from "@jonloucks/concurrency-ts/api/OnCompletion";
import { Waitable } from "@jonloucks/concurrency-ts/api/Waitable";
import { WaitableNotify } from "@jonloucks/concurrency-ts/api/WaitableNotify";
import { StateMachine } from "@jonloucks/concurrency-ts/api/StateMachine";
import { AUTO_CLOSE_FACTORY, AutoClose, AutoCloseFactory, Contracts, OptionalType } from "@jonloucks/contracts-ts";
import { Idempotent } from "@jonloucks/concurrency-ts/api/Idempotent";

import { create as createStateMachine } from "./StateMachine.impl";
import { create as createWaitable } from "./Waitable.impl";
import { create as createIdempotent } from "./Idempotent.impl";
import { contractsCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { AutoCloseMany, inlineAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";

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

  notify(_onCompletion: OnCompletion<T>): AutoClose {
    throw new Error("Method not implemented.");
  }

  onCompletion(_completion: Completion<T>): void {
    throw new Error("Method not implemented.");
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
  private readonly subscriptions: Set<unknown> = new Set<unknown>();
  private readonly closeMany: AutoCloseMany;
};