import { presentCheck } from "@jonloucks/contracts-ts/auxiliary/Checks";
import { ConsumerType, OptionalType, PredicateType, RequiredType, SupplierType } from "@jonloucks/concurrency-ts/api/Types";

export { presentCheck };

export function successBlockCheck<T>(block: OptionalType<SupplierType<T>>): RequiredType<SupplierType<T>> {
  return presentCheck(block, "Success block must be present.");
}

export function failureBlockCheck<T>(block: OptionalType<SupplierType<T>>): RequiredType<SupplierType<T>> {
  return presentCheck(block, "Failure block must be present.");
}

export function finallyBlockCheck<T>(block: OptionalType<SupplierType<T>>): RequiredType<SupplierType<T>> {
  return presentCheck(block, "Finally block must be present.");
}

export function onSuccessCheck<T>(onSuccess: OptionalType<ConsumerType<T>>): RequiredType<ConsumerType<T>> {
  return presentCheck(onSuccess, "OnSuccess consumer must be present.");
}

export function onFailureCheck(onFailure: OptionalType<ConsumerType<Error>>): RequiredType<ConsumerType<Error>> {
  return presentCheck(onFailure, "OnFailure consumer must be present.");
}

export function onFinallyCheck<T>(onFinally: OptionalType<ConsumerType<T>>): RequiredType<ConsumerType<T>> {
  return presentCheck(onFinally, "OnFinally consumer must be present.");
}

export function predicateCheck<T>(predicate: OptionalType<PredicateType<T>>): RequiredType<PredicateType<T>> {
  return presentCheck(predicate, "Predicate must be present.");
}
