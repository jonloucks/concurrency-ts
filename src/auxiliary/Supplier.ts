/**
 * Supplier.ts
 * Candidate for inclusion in api-ts
 * Defines a Supplier type that can supply values of type T.
 */

import { guardFunctions, isFunction, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";

export type Method<T> = () => T;

export interface Supplier<T> { supply(): T; } 

export type Type<T> = Method<T> | Supplier<T> | T; 

export function guard<T>(instance: unknown): instance is RequiredType<Supplier<T>> {
  return guardFunctions(instance, 'supply');
}

export function fromType<T>(type: Type<T>): RequiredType<Supplier<T>> {
  if (guard(type)) {
    return type;
  } else if (isFunction(type)) {
    return {
      supply: type
    }
  } else {
    return {
      supply: () => type
    }
  }
}

export function toValue<T>(type: Type<T>): T {
  if (guard(type)) {
    return type.supply();
  } else if (isFunction(type)) {
    return type();
  } else {
    return type;
  }
}

export function check<T>(supplier: Type<T>): Type<T> {
  return presentCheck(supplier, "Supplier must be Present.");
}