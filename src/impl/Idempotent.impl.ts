import { isFunction } from "@jonloucks/contracts-ts/api/Types";
import { Idempotent, Config, OpenType } from "@jonloucks/concurrency-ts/api/Idempotent";
import { IdempotentState, getStateMachineConfig } from "@jonloucks/concurrency-ts/api/IdempotenState";
import { AUTO_CLOSE_NONE, AutoClose, AutoCloseMany, inlineAutoClose, typeToAutoClose } from "@jonloucks/contracts-ts/api/AutoClose";
import { Open, guard as guardOpen } from "@jonloucks/contracts-ts/api/Open";
import { guard as guardAutoOpen } from "@jonloucks/contracts-ts/api/AutoOpen";
import { StateMachine } from "@jonloucks/concurrency-ts/api/StateMachine";
import { presentCheck } from "@jonloucks/concurrency-ts/auxiliary/Checks";
import { AutoCloseFactory, CONTRACT as AUTO_CLOSE_FACTORY } from "@jonloucks/contracts-ts/api/AutoCloseFactory";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";

import { create as createStateMachine } from "./StateMachine.impl";
import { Internal } from "./Internal.impl";

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
  getState(): IdempotentState {
    return this._stateMachine.getState();
  }

  // Idempotent.getStateMachine
  getStateMachine(): StateMachine<IdempotentState> {
    return this._stateMachine;
  }

  // Idempotent.open
  open(): AutoClose {
    return this._stateMachine.transition<AutoClose>({
      event: "open",
      successState: "OPENED",
      getSuccessValue: (): AutoClose => this.firstOpen(),
      getFailedValue: (): AutoClose => AUTO_CLOSE_NONE // no-op close for already opened
    }
    )!;
  }

  private firstOpen(): AutoClose {
    this._closeMany.add(presentCheck(this._delegate.open(), "Close must be present."))
    try {
      return this._firstClose;
    } catch (thrown) {
      this._closeMany.close();
      throw thrown;
    }
  }

  static internalCreate(config: Config): Idempotent {
    return new IdempotentImpl(config);
  }

  private constructor(config: Config) {
    const contracts: Contracts = Internal.resolveContracts(config);
    const closeFactory: AutoCloseFactory = contracts.enforce(AUTO_CLOSE_FACTORY);
    this._closeMany = closeFactory.createAutoCloseMany();
    this._delegate = typeToOpen(config.open);
    const stateMachineConfig = getStateMachineConfig();
    this._stateMachine = createStateMachine({ ...stateMachineConfig, contracts: contracts });
    this._firstClose = inlineAutoClose(() => {
      this._stateMachine.transition<void>({
        event: "close",
        successState: "CLOSED",
        getSuccessValue: (): void => this._closeMany.close(),
        getFailedValue: (): boolean => { return true },
        getErrorValue: (): boolean => { return true; } // review this, should not error on close?
      });
    });
  }

  private readonly _delegate: Open;
  private readonly _closeMany: AutoCloseMany;
  private readonly _stateMachine: StateMachine<IdempotentState>;
  private readonly _firstClose: AutoClose;
}
