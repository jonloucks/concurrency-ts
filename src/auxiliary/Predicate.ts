/**
 * Predicate.ts
 * 
 * Candidate for inclusion in api-ts
 * Defines a Predicate type that can test values of type T.
 */

import { guardFunctions, OptionalType, RequiredType } from "@jonloucks/concurrency-ts/api/Types";
import { presentCheck } from "./Checks";

export type Method<T> = (value: T) => boolean;

export interface Predicate<T> { test(value: T): boolean; }

export type Type<T> = Method<T> | Predicate<T> | boolean;

export function guard<T>(instance: unknown): instance is Predicate<T> {
  return guardFunctions(instance, 'test');
}

export function fromType<T>(type: Type<T>): Predicate<T> {
  if (guard(type)) {
    return type;
  } else if (typeof type === 'boolean') {
    return {
      test: (_: T) => type
    };
  } else {
    return {
      test: type
    };
  }
}

export function toValue<T>(type: Type<T>, value: T): boolean {
  if (guard(type)) {
    return type.test(value);
  } else if (typeof type === 'boolean') {
    return type;
  } else {
    return type(value);
  }
}

export function check<T>(predicate: OptionalType<Predicate<T>>): RequiredType<Predicate<T>> {
  return presentCheck(predicate, "Predicate must be Present.");
}