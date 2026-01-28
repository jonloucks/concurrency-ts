import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { Predicate, Type, guard, Method, fromType, check, toValue } from "@jonloucks/concurrency-ts/auxiliary/Predicate";
import { assertGuard } from "./helper.test";
import { OptionalType } from "../api/Types";

describe('Predicate Tests', () => {
  it('isPredicate should return true for Predicate', () => {
    const predicate: Predicate<string> = mock<Predicate<string>>();
    ok(guard(predicate), 'Predicate should return true');
  });
});

describe('fromType Tests', () => {
  it('fromType should convert Method to Predicate', () => {
    const method: Method<number> = (_value: number) => true;
    const predicate: Predicate<number> = fromType<number>(method);
    ok(guard(predicate), 'fromType should return a valid Predicate');
  });

  it('fromType should return Predicate as is', () => {
    const originalPredicate: Predicate<number> = mock<Predicate<number>>();
    const predicate: Predicate<number> = fromType<number>(originalPredicate);
    ok(predicate === originalPredicate, 'fromType should return the original Predicate');
  });

  it ('fromType should convert boolean to Predicate', () => {
    const predicateTrue: Predicate<number> = fromType<number>(true);
    const predicateFalse: Predicate<number> = fromType<number>(false);
    ok(guard(predicateTrue), 'fromType should return a valid Predicate for true');
    ok(guard(predicateFalse), 'fromType should return a valid Predicate for false');
  });

  it ('fromType Predicate test method should return correct boolean', () => {
    const predicateTrue: Predicate<number> = fromType<number>(true);
    const predicateFalse: Predicate<number> = fromType<number>(false);
    ok(predicateTrue.test(0) === true, 'Predicate test should return true for true type');
    ok(predicateFalse.test(0) === false, 'Predicate test should return false for false type');
  });
});

describe('toValue Tests', () => {
  it('toValue should return correct boolean for Predicate', () => {
    const predicate: Predicate<number> = {
      test: (value: number) => value > 10
    };
    const result = toValue<number>(predicate, 15);
    ok(result === true, 'toValue should return true for value greater than 10');
  });

  it('toValue should return correct boolean for Method', () => {
    const method: Method<number> = (value: number) => value < 5;
    const result = toValue<number>(method, 3);
    ok(result === true, 'toValue should return true for value less than 5');
  });

  it('toValue should return correct boolean for boolean type', () => {
    const resultTrue = toValue<number>(true, 0);
    const resultFalse = toValue<number>(false, 0);
    ok(resultTrue === true, 'toValue should return true for boolean true');
    ok(resultFalse === false, 'toValue should return false for boolean false');
  });
});

describe('check Tests', () => {
  it('check should return the Predicate if present', () => {
    const predicate: Predicate<string> = mock<Predicate<string>>();
    const checkedPredicate: Type<string> = check<string>(predicate);
    ok(checkedPredicate === predicate, 'check should return the original Predicate');
  });

  it('check should throw error if Predicate is null or undefined', () => {
    let errorCaught = false;
    try {
      check<string>(null as unknown as OptionalType<Predicate<string>>);
    } catch (_) {
      errorCaught = true;
    }
    ok(errorCaught, 'check should throw an error for null Predicate');
  });
});

assertGuard(guard, 'test');