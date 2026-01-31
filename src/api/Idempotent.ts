import { AutoCloseType } from "@jonloucks/contracts-ts/api/AutoClose";
import { Open } from "@jonloucks/contracts-ts/api/Open";
import { AutoOpen } from "@jonloucks/contracts-ts/api/AutoOpen";
import { State } from "@jonloucks/concurrency-ts/api/IdempotenState";
import { Contracts } from "@jonloucks/contracts-ts/api/Contracts";
import { guardFunctions, RequiredType } from "@jonloucks/contracts-ts/api/Types";

/**
 * The type returned when opening an Idempotent
 */
export type CloseType = AutoCloseType;

/**
 * The type used to open an Idempotent
 */
export type OpenType = AutoOpen | Open | (() => CloseType);

/** 
 * The configuration used to create a new Idempotent instance
 */
export interface Config {

  /** The Contracts instance to use */
  contracts: Contracts;

  /** The Open type to use when opening the Idempotent */
  open: OpenType;
}

/**
 * The Idempotent API
 */
export interface Idempotent extends Open {

  /**
   * Get the current state of the Idempotent
   *
   * @return the current state
   */
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
