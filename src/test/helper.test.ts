import { ok } from "node:assert";
import { describe, it } from "node:test";

import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { isRatifiedContract } from "@jonloucks/contracts-ts/api/RatifiedContract";

describe('Helper Tests', () => {
  it('should run a place holder test', () => {
    ok(true, 'Place holder test should pass');
  });
});

export function assertContract<T>(contract: Contract<T>, name: string): void {
  describe(`${name} CONTRACT test`, () => {
    it(`${name} CONTRACT should be ratified with a name`, () => {
      ok(isRatifiedContract(contract), `${name} isRatifiedContract should return true`);
      ok(contract.name === name, `CONTRACT name should be ${name}`);
      if (contract.guarded === false) {
        ok(contract.cast(null) === null, `${name} CONTRACT.cast(null) should return null`);
        ok(contract.cast(undefined) === undefined, `${name} CONTRACT.cast(undefined) should return undefined`);
      }
    });
  });
}

type Guard<T> = (o: unknown) => o is T;

/**
 * Simple mock function type with basic Jest-like API
 */
type MockFunction = {
  (...args: unknown[]): unknown;
  mockImplementation: (fn: (...args: unknown[]) => unknown) => MockFunction;
  mockReturnValue: (value: unknown) => MockFunction;
  calls: unknown[][];
};

/**
 * Create a mock function with basic mocking capabilities
 */
function createMockFunction(): MockFunction {
  let implementation: ((...args: unknown[]) => unknown) | undefined;
  let returnValue: unknown;
  const calls: unknown[][] = [];

  const mockFn = function(...args: unknown[]): unknown {
    calls.push(args);
    if (implementation) {
      return implementation(...args);
    }
    return returnValue;
  } as MockFunction;

  mockFn.mockImplementation = (fn: (...args: unknown[]) => unknown): MockFunction => {
    implementation = fn;
    return mockFn;
  };

  mockFn.mockReturnValue = (value: unknown): MockFunction => {
    returnValue = value;
    return mockFn;
  };

  mockFn.calls = calls;

  return mockFn;
}

/**
 * Simple mock object proxy that creates properties on access.
 * Replaces jest-mock-extended for basic duck typing tests.
 * 
 * @param propertyNames the names of methods to be auto created
 */
export function mockDuck<T>(...propertyNames: (string | symbol)[]): T {
  const mocked: Record<string | symbol, unknown> = {};
  const lookup = mocked as Record<string | symbol, unknown>;
  for (const propertyName of propertyNames) {
    // Create a mock function for each property
    lookup[propertyName] = createMockFunction();
  }
  return mocked as T;
}

export function assertGuard<T>(guard: Guard<T>, ...propertyNames: (string | symbol)[]): void {
  if (propertyNames.length === 0) {
    return;
  }

  const combinations: (string | symbol)[][] = generateCombinations(propertyNames);
  combinations.forEach((combination) => {
    const joinedMixed: string = combination
      .map(item => typeof item === 'symbol' ? String(item) : item)
      .join(', ');

    it(`Guard should return true for object with properties: ${joinedMixed}`, () => {
      const obj: Record<string | symbol, unknown> = {};
      combination.forEach((prop) => {
        obj[prop] = (): void => { }; // currently assuming a function
      });
      if (combination.length === propertyNames.length) {
        // Full set of properties
        ok(guard(obj), `Object with all properties ${joinedMixed} should be recognized as duck type`);
      } else {
        // Partial set of properties
        ok(!guard(obj), `Object with partial properties ${joinedMixed} should NOT be recognized as duck type`);
      }
    });
  });
  it(`Guard should return false for object with no properties`, () => {
    const emptyObj: Record<string | symbol, unknown> = {};
    ok(!guard(emptyObj), `Empty object should not be recognized as duck type`);
  });
  it(`Guard should return false for null and undefined`, () => {
    ok(!guard(null), 'guard should never return null');
    ok(!guard(undefined), 'guard should never return undefined');
  });
};

function generateCombinations<T>(items: T[]): T[][] {
  const result: T[][] = [];

  function backtrack(index: number, currentCombination: T[]): void {
    // Add the current combination to the results list
    result.push([...currentCombination]);

    // Iterate through the remaining elements
    for (let i = index; i < items.length; i++) {
      // Include the current element in the combination
      currentCombination.push(items[i]);
      // Recurse to find combinations with the current element included
      backtrack(i + 1, currentCombination);
      // Backtrack: remove the current element to explore other possibilities
      currentCombination.pop();
    }
  }

  backtrack(0, []);
  return result;
}