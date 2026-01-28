import { presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { ConsumerType, OptionalType, PredicateType, RequiredType, SupplierType } from "@jonloucks/concurrency-ts/api/Types";

export { presentCheck };

export function successBlockCheck<T>(block: OptionalType<SupplierType<T>>): RequiredType<SupplierType<T>> {
  return presentCheck(block, "Success block must be Present.");
}

export function failureBlockCheck<T>(block: OptionalType<SupplierType<T>>): RequiredType<SupplierType<T>> {
  return presentCheck(block, "Failure block must be Present.");
}

export function finallyBlockCheck<T>(block: OptionalType<SupplierType<T>>): RequiredType<SupplierType<T>> {
  return presentCheck(block, "Finally block must be Present.");
}

export function onSuccessCheck<T>(onSuccess: OptionalType<ConsumerType<T>>): RequiredType<ConsumerType<T>> {
  return presentCheck(onSuccess, "OnSuccess consumer must be Present.");
}

export function onFailureCheck(onFailure: OptionalType<ConsumerType<Error>>): RequiredType<ConsumerType<Error>> {
  return presentCheck(onFailure, "OnFailure consumer must be Present.");
}

export function onFinallyCheck<T>(onFinally: OptionalType<ConsumerType<T>>): RequiredType<ConsumerType<T>> {
  return presentCheck(onFinally, "OnFinally consumer must be Present.");
}

export function predicateCheck<T>(predicate: OptionalType<PredicateType<T>>): RequiredType<PredicateType<T>> {
  return presentCheck(predicate, "Predicate must be Present.");
}
