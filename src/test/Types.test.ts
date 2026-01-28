import { ok, strictEqual } from "node:assert";

import { presentCheck } from "@jonloucks/concurrency-ts/auxiliary/Checks";

import {
  Consumer,
  ConsumerFunction,
  consumerGuard,
  ConsumerType,
  Duration,
  guardFunctions,
  isNotPresent,
  isNumber,
  isPresent,
  isString,
  isThrowable,
  MAX_TIMEOUT,
  MIN_TIMEOUT,
  OptionalType,
  Predicate,
  PredicateFunction,
  predicateGuard,
  PredicateType,
  RequiredType,
  Supplier,
  SupplierFunction,
  supplierGuard,
  supplierToValue,
  SupplierType,
  Throwable
} from "@jonloucks/concurrency-ts/api/Types";

describe("Types", () => {
  describe("isThrowable", () => {
    it("should return true for all values", () => {
      expect(isThrowable(null)).toBe(true);
      expect(isThrowable(undefined)).toBe(true);
      expect(isThrowable(new Error("error"))).toBe(true);
      expect(isThrowable("string")).toBe(true);
      expect(isThrowable(42)).toBe(true);
      expect(isThrowable({})).toBe(true);
      expect(isThrowable([])).toBe(true);
    });
  });
});

describe('Duration Type Tests', () => {
  it('Duration type should create correct durations', () => {
    const duration1: Duration = { milliSeconds: 5000 };
    const duration2: Duration = { milliSeconds: 0 };
    const duration3: Duration = { milliSeconds: 123456789 };
    strictEqual(duration1.milliSeconds, 5000, 'duration1 should be 5000 milliseconds');
    strictEqual(duration2.milliSeconds, 0, 'duration2 should be 0 milliseconds');
    strictEqual(duration3.milliSeconds, 123456789, 'duration3 should be 123456789 milliseconds');
  });
});

describe('concurrency-ts/auxiliary/Checks Index exports', () => {
  it('should export all expected members', () => {
    strictEqual(presentCheck("green", "not easy being green"), "green");
    assertNothing(null as OptionalType<Throwable<number>>);
    assertNothing("abc" as RequiredType<string>);
    ok(isString, 'isString should be accessible');
    ok(isNumber, 'isNumber should be accessible');
    ok(isPresent, 'isPresent should be accessible');
    ok(isNotPresent, 'isNotPresent should be accessible');
  });
});

describe('typeToValue function', () => {
  it('should return the underlying value for direct values', () => {
    strictEqual(supplierToValue(42), 42, 'Number value should be 42');
    strictEqual(supplierToValue("hello"), "hello", 'String value should be "hello"');
    strictEqual(supplierToValue(null), null, 'Value should be null');
    strictEqual(supplierToValue(undefined), undefined, 'Value should be undefined');
  });

  it('should return the value from a SupplierFunction', () => {
    const supplierFunc = () : number => 100;
    strictEqual(supplierToValue(supplierFunc), 100, 'Supplier function should return 100');
  });

  it('should return the value from a Supplier object', () => {
    const supplierObj: RequiredType<Supplier<number>> = {
      supply: () : number => 200
    };
    strictEqual(supplierToValue(supplierObj), 200, 'Supplier object should return 200');
  });
});

describe('Constants', () => {
  it('should have a positive min timeout', () => {
    strictEqual(MIN_TIMEOUT.milliSeconds >= 0, true, 'MIN_TIMEOUT should be positive');
  });

  it('should have a max timeout greater than min timeout', () => {
    strictEqual(MAX_TIMEOUT.milliSeconds > MIN_TIMEOUT.milliSeconds, true, 'MAX_TIMEOUT should be greater than MIN_TIMEOUT');
  });

  it('should have max timeout less than or equal to Number.MAX_SAFE_INTEGER', () => {
    strictEqual(MAX_TIMEOUT.milliSeconds <= Number.MAX_SAFE_INTEGER, true, 'MAX_TIMEOUT should be less than or equal to Number.MAX_SAFE_INTEGER');
  });

  it('should have MIN_TIMEOUT equal to 0', () => {
    strictEqual(MIN_TIMEOUT.milliSeconds, 0, 'MIN_TIMEOUT should be 0 milliseconds');
  });

  it('should have MAX_TIMEOUT equal to Number.MAX_SAFE_INTEGER', () => {
    strictEqual(MAX_TIMEOUT.milliSeconds, Number.MAX_SAFE_INTEGER, 'MAX_TIMEOUT should be Number.MAX_SAFE_INTEGER');
  });
});

describe('Consumer Type', () => {
  it('should accept a consumer function', () => {
    const consumer: ConsumerType<number> = (value: number) => { 
      strictEqual(value, 42);
    };
    consumer(42);
  });

  it('should accept a Consumer object', () => {
    const consumer: ConsumerType<string> = {
      consume: (value: string) => {
        strictEqual(value, "test");
      }
    };
    if (typeof consumer !== 'function') {
      consumer.consume("test");
    }
  });
});

describe('consumerGuard function', () => {
  it('should return true for Consumer objects', () => {
    const consumer: Consumer<number> = {
      consume: (_value: number) => { }
    };
    strictEqual(consumerGuard(consumer), true, 'Should identify Consumer object');
  });

  it('should return false for consumer functions', () => {
    const consumer = (_value: number) => { };
    strictEqual(consumerGuard(consumer), false, 'Should not identify function as Consumer object');
  });

  it('should return false for non-consumer objects', () => {
    strictEqual(consumerGuard({}), false, 'Empty object should not be a Consumer');
    strictEqual(consumerGuard(null), false, 'null should not be a Consumer');
    strictEqual(consumerGuard(undefined), false, 'undefined should not be a Consumer');
    strictEqual(consumerGuard(42), false, 'number should not be a Consumer');
  });
});

describe('Predicate Type', () => {
  it('should accept a predicate function', () => {
    const predicate: PredicateType<number> = (value: number) => value > 0;
    strictEqual(predicate(10), true);
    strictEqual(predicate(-5), false);
  });

  it('should accept a Predicate object', () => {
    const predicate: PredicateType<string> = {
      test: (value: string) => value.length > 0
    };
    if (typeof predicate !== 'function' && typeof predicate !== 'boolean') {
      strictEqual(predicate.test("hello"), true);
      strictEqual(predicate.test(""), false);
    }
  });

  it('should accept a boolean value', () => {
    const alwaysTrue: PredicateType<any> = true;
    const alwaysFalse: PredicateType<any> = false;
    strictEqual(alwaysTrue, true);
    strictEqual(alwaysFalse, false);
  });
});

describe('predicateGuard function', () => {
  it('should return true for Predicate objects', () => {
    const predicate: Predicate<number> = {
      test: (_value: number) => true
    };
    strictEqual(predicateGuard(predicate), true, 'Should identify Predicate object');
  });

  it('should return false for predicate functions', () => {
    const predicate = (_value: number) => true;
    strictEqual(predicateGuard(predicate), false, 'Should not identify function as Predicate object');
  });

  it('should return false for boolean values', () => {
    strictEqual(predicateGuard(true), false, 'true should not be a Predicate object');
    strictEqual(predicateGuard(false), false, 'false should not be a Predicate object');
  });

  it('should return false for non-predicate objects', () => {
    strictEqual(predicateGuard({}), false, 'Empty object should not be a Predicate');
    strictEqual(predicateGuard(null), false, 'null should not be a Predicate');
    strictEqual(predicateGuard(undefined), false, 'undefined should not be a Predicate');
  });
});

describe('Supplier Type', () => {
  it('should accept a supplier function', () => {
    const supplier: SupplierType<number> = () => 42;
    strictEqual(supplier(), 42);
  });

  it('should accept a Supplier object', () => {
    const supplier: SupplierType<string> = {
      supply: () => "hello"
    };
    if (typeof supplier !== 'function' && supplier !== null && typeof supplier === 'object' && 'supply' in supplier) {
      strictEqual(supplier.supply(), "hello");
    }
  });

  it('should accept a direct value', () => {
    const supplier: SupplierType<number> = 100;
    strictEqual(supplier, 100);
  });
});

describe('supplierGuard function', () => {
  it('should return true for Supplier objects', () => {
    const supplier: Supplier<number> = {
      supply: () => 42
    };
    strictEqual(supplierGuard(supplier), true, 'Should identify Supplier object');
  });

  it('should return false for supplier functions', () => {
    const supplier = () => 42;
    strictEqual(supplierGuard(supplier), false, 'Should not identify function as Supplier object');
  });

  it('should return false for direct values', () => {
    strictEqual(supplierGuard(42), false, 'number should not be a Supplier object');
    strictEqual(supplierGuard("test"), false, 'string should not be a Supplier object');
  });

  it('should return false for non-supplier objects', () => {
    strictEqual(supplierGuard({}), false, 'Empty object should not be a Supplier');
    strictEqual(supplierGuard(null), false, 'null should not be a Supplier');
    strictEqual(supplierGuard(undefined), false, 'undefined should not be a Supplier');
  });
});

describe('Throwable Type', () => {
  it('should allow null values', () => {
    const throwable: Throwable<string> = null;
    strictEqual(throwable, null);
  });

  it('should allow undefined values', () => {
    const throwable: Throwable<number> = undefined;
    strictEqual(throwable, undefined);
  });

  it('should allow actual values', () => {
    const throwable: Throwable<string> = "value";
    strictEqual(throwable, "value");
  });
});

describe('Type Guards from contracts-ts', () => {
  it('isString should correctly identify strings', () => {
    strictEqual(isString("test"), true, 'Should identify string');
    strictEqual(isString(123), false, 'Should not identify number as string');
    strictEqual(isString(null), false, 'Should not identify null as string');
  });

  it('isNumber should correctly identify numbers', () => {
    strictEqual(isNumber(123), true, 'Should identify number');
    strictEqual(isNumber("test"), false, 'Should not identify string as number');
    strictEqual(isNumber(null), false, 'Should not identify null as number');
  });

  it('isPresent should correctly identify present values', () => {
    strictEqual(isPresent("test"), true, 'Should identify string as present');
    strictEqual(isPresent(0), true, 'Should identify 0 as present');
    strictEqual(isPresent(false), true, 'Should identify false as present');
    strictEqual(isPresent(null), false, 'Should identify null as not present');
    strictEqual(isPresent(undefined), false, 'Should identify undefined as not present');
  });

  it('isNotPresent should correctly identify absent values', () => {
    strictEqual(isNotPresent(null), true, 'Should identify null as not present');
    strictEqual(isNotPresent(undefined), true, 'Should identify undefined as not present');
    strictEqual(isNotPresent("test"), false, 'Should identify string as present');
    strictEqual(isNotPresent(0), false, 'Should identify 0 as present');
  });
});

describe('Duration with different millisecond values', () => {
  it('should handle negative milliseconds', () => {
    const duration: Duration = { milliSeconds: -100 };
    strictEqual(duration.milliSeconds, -100);
  });

  it('should handle very large milliseconds', () => {
    const duration: Duration = { milliSeconds: Number.MAX_SAFE_INTEGER };
    strictEqual(duration.milliSeconds, Number.MAX_SAFE_INTEGER);
  });

  it('should handle fractional milliseconds', () => {
    const duration: Duration = { milliSeconds: 123.456 };
    strictEqual(duration.milliSeconds, 123.456);
  });
});

describe('Function Type Aliases', () => {
  it('ConsumerFunction should accept functions that consume values', () => {
    const consumer: ConsumerFunction<string> = (value: string) => {
      strictEqual(value, "test");
    };
    consumer("test");
  });

  it('PredicateFunction should accept functions that test values', () => {
    const predicate: PredicateFunction<number> = (value: number) => value % 2 === 0;
    strictEqual(predicate(4), true);
    strictEqual(predicate(3), false);
  });

  it('SupplierFunction should accept functions that supply values', () => {
    const supplier: SupplierFunction<boolean> = () => true;
    strictEqual(supplier(), true);
  });
});

describe('guardFunctions utility', () => {
  it('should return true when object has specified method names', () => {
    const obj = {
      consume: () => {},
      supply: () => 42
    };
    strictEqual(guardFunctions(obj, 'consume'), true, 'Object should have consume method');
    strictEqual(guardFunctions(obj, 'supply'), true, 'Object should have supply method');
  });

  it('should return true when object has all specified method names', () => {
    const obj = {
      consume: () => {},
      supply: () => 42
    };
    strictEqual(guardFunctions(obj, 'consume', 'supply'), true, 'Object should have both methods');
  });

  it('should return false when object does not have specified method', () => {
    const obj = {
      consume: () => {}
    };
    strictEqual(guardFunctions(obj, 'supply'), false, 'Object should not have supply method');
  });

  it('should return false for null', () => {
    strictEqual(guardFunctions(null, 'test'), false, 'null should not have any methods');
  });

  it('should return false for undefined', () => {
    strictEqual(guardFunctions(undefined, 'test'), false, 'undefined should not have any methods');
  });

  it('should return false for primitives', () => {
    strictEqual(guardFunctions(42, 'test'), false, 'number should not have custom methods');
    strictEqual(guardFunctions("test", 'test'), false, 'string should not have custom methods');
  });

  it('should return false when property exists but is not a function', () => {
    const obj = {
      consume: "not a function"
    };
    strictEqual(guardFunctions(obj, 'consume'), false, 'Property should be a function');
  });
});

function assertNothing(_value: OptionalType<unknown>): void {
  ok(true, 'This function is only for compile-time type checking and should never be called at runtime');
}