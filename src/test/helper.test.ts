import { ok } from "node:assert";

import { Contract } from "@jonloucks/contracts-ts/api/Contract";
import { isRatifiedContract } from "@jonloucks/contracts-ts/api/RatifiedContract";

describe('Helper Tests', () => {
  it('should run a place holder test', () => {
    ok(true, 'Place holder test should pass');
  });
});

export function assertContract<T>(contract: Contract<T>, name: string): void {
  describe(`${name} CONTRACT test`, () => {
    it(`${name} CONTRACT should be ratified`, () => {
      ok(isRatifiedContract(contract), `${name} CONTRACT should be ratified`);  
      ok(contract.name === name, `CONTRACT name should be ${name}`); 
      ok(contract.cast(null) === null, `${name} CONTRACT.cast(null) should return null`);
      ok(contract.cast(undefined) === undefined, `${name} CONTRACT.cast(undefined) should return undefined`);
    });
  });
}

type IsDuck<T> = (o: unknown) => o is T;

export function assertDuck<T>(isDuck: IsDuck<T>, ...propertyNames: (string | symbol)[]): void {
  if (propertyNames.length === 0) {
    return;
  }

  const combinations : (string | symbol)[][] = generateCombinations(propertyNames);
  combinations.forEach((combination) => {
    it(`isDuck should return true for object with properties: ${combination.join(', ')}`, () => {
      const obj: Record<string | symbol, unknown> = {};
      combination.forEach((prop) => {
        obj[prop] = () : void => {}; // currently assuming a function
      });
      if (combination.length === propertyNames.length) {
        // Full set of properties
        ok(isDuck(obj), `Object with all properties ${combination.join(', ')} should be recognized as duck type`);
      } else {
        // Partial set of properties
        ok(!isDuck(obj), `Object with partial properties ${combination.join(', ')} should NOT be recognized as duck type`);
      }
    });
  });
  it(`isDuck should return false for object with no properties`, () => {
    const emptyObj: Record<string | symbol, unknown> = {};
    ok(!isDuck(emptyObj), `Empty object should not be recognized as duck type`);
  });  
  it (`isDuck should return true for null and undefined`, () => {
    ok(isDuck(null), 'null should be recognized as duck type');
    ok(isDuck(undefined), 'undefined should be recognized as duck type');
  });
};

function generateCombinations<T>(items: T[]): T[][] {
  const result: T[][] = [];

  function backtrack(index: number, currentCombination: T[]) : void  {
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