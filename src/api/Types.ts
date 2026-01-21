export { isNotPresent, isNumber, isPresent, isString, OptionalType, RequiredType } from "@jonloucks/contracts-ts/api/Types";

// candidate for inclusion in contracts-ts/api/Types.ts
export type Throwable<T> = T | null | undefined;
export function isThrowable<T>(value: unknown): value is Throwable<T> { return true; }

export type ConsumerFunction<T> = (value: T) => void;
export interface Consumer<T> { accept(value: T): void; }
export type ConsumerType<T> = ConsumerFunction<T> | Consumer<T>;

export type SupplierFunction<T> = () => T;
export interface Supplier<T> { get(): T; }
export type SupplierType<T> = SupplierFunction<T> | Supplier<T>;

export type PredicateFunction<T> = (value: T) => boolean;
export interface Predicate<T> { test(value: T): boolean; }
export type PredicateType<T> = PredicateFunction<T> | Predicate<T> | boolean;

// review if there is a something better to use here, like Java's Duration
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
