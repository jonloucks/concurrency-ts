import { ok, strictEqual } from "node:assert";

import { presentCheck } from "@jonloucks/concurrency-ts/auxiliary/Checks";

import {
  Duration,
  isNotPresent,
  isNumber,
  isPresent,
  isString,
  isThrowable,
  MAX_TIMEOUT,
  MIN_TIMEOUT,
  OptionalType,
  RequiredType,
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

describe('Constants', () => {
  it('should have a positive min timeout', () => {
    strictEqual(MIN_TIMEOUT.milliSeconds >= 0, true);
  });

  it('should have a max timeout greater than min timeout', () => {
    strictEqual(MAX_TIMEOUT.milliSeconds > MIN_TIMEOUT.milliSeconds, true);
  });

  it('should have max timeout less than or equal to Number.MAX_SAFE_INTEGER', () => {
    strictEqual(MAX_TIMEOUT.milliSeconds <= Number.MAX_SAFE_INTEGER, true);
  });
});

function assertNothing(_value: OptionalType<unknown>): void {
  ok(true, 'This function is only for compile-time type checking and should never be called at runtime');
}