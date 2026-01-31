import { AutoCloseType } from "@jonloucks/contracts-ts/api/AutoClose";
import { Open } from "@jonloucks/contracts-ts/api/Open";
import { AutoOpen } from "@jonloucks/contracts-ts/api/AutoOpen";
import { State } from "@jonloucks/concurrency-ts/api/IdempotenState";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { guardFunctions, RequiredType } from "@jonloucks/contracts-ts/api/Types";

export type CloseType = AutoCloseType;
export type OpenType = AutoOpen | Open | (() => CloseType);

export interface Config {

  contracts: Contracts;

  open: OpenType;
}

export interface Idempotent extends Open {

  getState(): State;

}

/**
 * Determine if an instance implements Completion
 * 
 * @param instance the instance to check
 * @returns true if the instance implements Completion
 */
export function guard(instance: unknown): instance is RequiredType<Idempotent> {
  return guardFunctions(instance,
    'getState',
    'open',
  );
} 
