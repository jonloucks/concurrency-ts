import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { OnCompletion, isOnCompletion } from "@jonloucks/concurrency-ts/api/OnCompletion";
import { assertDuck } from "./helper.test";

describe('OnCompletion Tests', () => {
  it('isOnCompletion should return true for OnCompletion', () => {
    const onCompletion: OnCompletion<string> = mock<OnCompletion<string>>();
    ok(isOnCompletion(onCompletion), 'OnCompletion should return true');
  }); 
});  

assertDuck(isOnCompletion, 'onCompletion');