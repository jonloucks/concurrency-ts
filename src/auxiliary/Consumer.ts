/**
 * Consumer.ts
 * Candidate for inclusion in api-ts
 * Defines a Consumer type that can consume values of type T.
 */

import { guardFunctions, RequiredType } from "@jonloucks/contracts-ts/api/Types";
import { presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";

export type Method<T> = (value: T) => void;

export interface Consumer<T> { consume(value: T): void; }

export type Type<T> = Method<T> | Consumer<T>;

export function guard<T>(instance: unknown): instance is RequiredType<Consumer<T>> {
  return guardFunctions(instance, 'consume');
}

export function fromType<T>(type: Type<T>): RequiredType<Consumer<T>> {
  if (guard(type)) {
    return type;
  } else {
    return {
      consume: type
    };
  }
}

export function check<T>(consumer: Type<T>): Type<T> {
  return presentCheck(consumer, "Consumer must be Present.");
}