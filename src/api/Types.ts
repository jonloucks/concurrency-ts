export { Consumer, Method as ConsumerFunction, guard as consumerGuard, Type as ConsumerType } from "@jonloucks/concurrency-ts/auxiliary/Consumer";
export { Predicate, Method as PredicateFunction, guard as predicateGuard, Type as PredicateType } from "@jonloucks/concurrency-ts/auxiliary/Predicate";
export { Supplier, Method as SupplierFunction, guard as supplierGuard, Type as SupplierType, toValue as supplierToValue } from "@jonloucks/concurrency-ts/auxiliary/Supplier";
export { guardFunctions, isNotPresent, isNumber, isPresent, isString, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";

// candidate for inclusion in api-ts
export type Throwable<T> = T | null | undefined;
export function isThrowable<T>(value: unknown): value is Throwable<T> { return true; }

// review if there is a something better to use here, like Java's Duration
// candidate for inclusion in api-ts
export interface Duration {
  get milliSeconds(): number;
}

export const MIN_TIMEOUT: Duration = {
  get milliSeconds() : number {
    return 0;
  }
};

export const MAX_TIMEOUT: Duration = {
  get milliSeconds() : number {
    return Number.MAX_SAFE_INTEGER;
  }
};

