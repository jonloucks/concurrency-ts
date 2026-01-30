import { isFunction } from "@jonloucks/contracts-ts/api/Types";
import { Idempotent, Config, OpenType } from "@jonloucks/concurrency-ts/api/Idempotent";
import { AUTO_CLOSE_NONE, AutoClose, AutoCloseMany, inlineAutoClose, typeToAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { Open, guard as guardOpen } from "@jonloucks/contracts-ts/api/Open";
import { guard as guardAutoOpen } from "@jonloucks/contracts-ts/api/AutoOpen";
import { State } from "@jonloucks/concurrency-ts/api/CompletionState";
import { StateMachine } from "@jonloucks/concurrency-ts/api/StateMachine";
import { IdempotentState, getStateMachineConfig } from "@jonloucks/concurrency-ts/api/IdempotentState";
import { presentCheck } from "@jonloucks/concurrency-ts/auxiliary/Checks";

import { create as createStateMachine } from "./StateMachine.impl";
import { AutoCloseFactory, CONTRACT as AUTO_CLOSE_FACTORY } from "@jonloucks/contracts-ts/api/AutoCloseFactory";
import { Contracts } from "@jonloucks/contracts-ts";
import { contractsCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";

/** 
 * Create a new Idempotent
 *
 * @param config the idempotent configuration
 * @return the new Idempotent
 */
export function create(config: Config): Idempotent {
  return IdempotentImpl.internalCreate(config);
}

// candidate for contracts-ts 
export function typeToOpen(type: OpenType): Open {
  if (guardAutoOpen(type)) {
    return {
      open: () => type.autoOpen()
    }
  } else if (guardOpen(type)) {
    return type;
  } else if (isFunction(type)) {
    return {
      open: () => typeToAutoClose(type())
    };
  } else {
    throw new Error("Invalid Open type.");
  }
}

// ---- Implementation details below ----

class IdempotentImpl implements Idempotent {

  // Idempotent.getState
  getState(): State {
    return this.stateMachine.getState();
  }

  // Idempotent.open
  open(): AutoClose {
    return this.stateMachine.transition<AutoClose>({
      event: "open",
      successState: "OPENED",
      getSuccessValue: (): AutoClose => this.firstOpen(),
      getFailedValue: (): AutoClose => AUTO_CLOSE_NONE // no-op close for already opened
    }
    )!;
  }

  private firstOpen(): AutoClose {
    this.closeMany.add(presentCheck(this.delegate.open(), "Close must be present."))
    try {
      return this.firstClose;
    } catch (thrown) {
      this.closeMany.close();
      throw thrown;
    }
  }

  static internalCreate(config: Config): Idempotent {
    return new IdempotentImpl(config);
  }

  private constructor(config: Config) {
    const contracts: Contracts = contractsCheck(config.contracts);
    const closeFactory: AutoCloseFactory = contracts.enforce(AUTO_CLOSE_FACTORY);
    this.closeMany = closeFactory.createAutoCloseMany();
    this.delegate = typeToOpen(config.open);
    const stateMachineConfig = getStateMachineConfig();
    this.stateMachine = createStateMachine({ ...stateMachineConfig, contracts });
    this.firstClose = inlineAutoClose(() => {
      this.stateMachine.transition<void>({
        event: "close",
        successState: "CLOSED",
        getSuccessValue: (): void => this.closeMany.close(),
        getFailedValue: (): boolean => { return true },
        getErrorValue: (): boolean => { return true; } // review this, should not error on close?
      });
    });
  }

  private readonly delegate: Open;
  private readonly closeMany: AutoCloseMany;
  private readonly stateMachine: StateMachine<IdempotentState>;
  private readonly firstClose: AutoClose;
}
