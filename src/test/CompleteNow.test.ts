import { ok, strictEqual, throws } from "node:assert";

import { Completion } from "@jonloucks/concurrency-ts/api/Completion";
import { OnCompletion } from "@jonloucks/concurrency-ts/api/OnCompletion";

import { completeNow } from "../impl/CompleteNow.impl";

describe('CompleteNow Tests', () => {
  describe('completeNow with success', () => {
    it('should complete with SUCCEEDED state when block succeeds', () => {
      let receivedCompletion: Completion<string> | null = null;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (completion: Completion<string>): void => {
          receivedCompletion = completion;
        }
      };

      const result = completeNow(onCompletion, () => 'test-value');

      strictEqual(result, 'test-value', 'Should return the value from success block');
      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<string>).getState(), 'SUCCEEDED', 'State should be SUCCEEDED');
      strictEqual((receivedCompletion as Completion<string>).getValue(), 'test-value', 'Value should match');
    });

    it('should complete with SUCCEEDED state for number type', () => {
      let receivedCompletion: Completion<number> | null = null;
      const onCompletion: OnCompletion<number> = {
        onCompletion: (completion: Completion<number>): void => {
          receivedCompletion = completion;
        }
      };

      const result = completeNow(onCompletion, () => 42);

      strictEqual(result, 42, 'Should return the number value');
      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<number>).getState(), 'SUCCEEDED', 'State should be SUCCEEDED');
      strictEqual((receivedCompletion as Completion<number>).getValue(), 42, 'Value should be 42');
    });

    it('should complete with SUCCEEDED state for object type', () => {
      const testObj = { name: 'test', value: 123 };
      let receivedCompletion: Completion<typeof testObj> | null = null;
      const onCompletion: OnCompletion<typeof testObj> = {
        onCompletion: (completion: Completion<typeof testObj>): void => {
          receivedCompletion = completion;
        }
      };

      const result = completeNow(onCompletion, () => testObj);

      strictEqual(result, testObj, 'Should return the object');
      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<typeof testObj>).getState(), 'SUCCEEDED', 'State should be SUCCEEDED');
      strictEqual((receivedCompletion as Completion<typeof testObj>).getValue(), testObj, 'Value should match object');
    });

    it('should work with Supplier object with supply method', () => {
      let receivedCompletion: Completion<string> | null = null;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (completion: Completion<string>): void => {
          receivedCompletion = completion;
        }
      };

      const supplier = {
        supply: (): string => 'supplied-value'
      };

      const result = completeNow(onCompletion, supplier);

      strictEqual(result, 'supplied-value', 'Should return value from supplier');
      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<string>).getState(), 'SUCCEEDED', 'State should be SUCCEEDED');
      strictEqual((receivedCompletion as Completion<string>).getValue(), 'supplied-value', 'Value should match');
    });

    it('should complete with SUCCEEDED when returning undefined', () => {
      let receivedCompletion: Completion<undefined> | null = null;
      const onCompletion: OnCompletion<undefined> = {
        onCompletion: (completion: Completion<undefined>): void => {
          receivedCompletion = completion;
        }
      };

      const result = completeNow(onCompletion, () => undefined);

      strictEqual(result, undefined, 'Should return undefined');
      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<undefined>).getState(), 'SUCCEEDED', 'State should be SUCCEEDED');
    });

    it('should complete with SUCCEEDED when returning null', () => {
      let receivedCompletion: Completion<null> | null = null;
      const onCompletion: OnCompletion<null> = {
        onCompletion: (completion: Completion<null>): void => {
          receivedCompletion = completion;
        }
      };

      const result = completeNow(onCompletion, () => null);

      strictEqual(result, null, 'Should return null');
      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<null>).getState(), 'SUCCEEDED', 'State should be SUCCEEDED');
      strictEqual((receivedCompletion as Completion<null>).getValue(), null, 'Value should be null');
    });
  });

  describe('completeNow with failure', () => {
    it('should complete with FAILED state when block throws', () => {
      let receivedCompletion: Completion<string> | null = null;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (completion: Completion<string>): void => {
          receivedCompletion = completion;
        }
      };

      const testError = new Error('test error');

      throws(() => {
        completeNow(onCompletion, () => {
          throw testError;
        });
      });

      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<string>).getState(), 'FAILED', 'State should be FAILED');
      strictEqual((receivedCompletion as Completion<string>).getThrown(), testError, 'Should have thrown error');
    });

    it('should complete with FAILED state when supplier throws', () => {
      let receivedCompletion: Completion<string> | null = null;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (completion: Completion<string>): void => {
          receivedCompletion = completion;
        }
      };

      const testError = new Error('supplier error');
      const supplier = {
        supply: (): string => {
          throw testError;
        }
      };

      throws(() => {
        completeNow(onCompletion, supplier);
      });

      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<string>).getState(), 'FAILED', 'State should be FAILED');
      strictEqual((receivedCompletion as Completion<string>).getThrown(), testError, 'Should have thrown error');
    });

    it('should complete with FAILED state when throwing string', () => {
      let receivedCompletion: Completion<number> | null = null;
      const onCompletion: OnCompletion<number> = {
        onCompletion: (completion: Completion<number>): void => {
          receivedCompletion = completion;
        }
      };

      throws(() => {
        completeNow(onCompletion, () => {
          throw 'string error';
        });
      });

      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<string>).getState(), 'FAILED', 'State should be FAILED');
      strictEqual((receivedCompletion as Completion<string>).getThrown(), 'string error', 'Should have thrown string');
    });

    it('should complete with FAILED state when throwing custom object', () => {
      let receivedCompletion: Completion<number> | null = null;
      const onCompletion: OnCompletion<number> = {
        onCompletion: (completion: Completion<number>): void => {
          receivedCompletion = completion;
        }
      };

      const customError = { code: 500, message: 'custom error' };

      throws(() => {
        completeNow(onCompletion, () => {
          throw customError;
        });
      });

      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<string>).getState(), 'FAILED', 'State should be FAILED');
      strictEqual((receivedCompletion as Completion<string>).getThrown(), customError, 'Should have thrown custom error');
    });
  });

  describe('completeNow validation', () => {
    it('should validate onCompletion parameter', () => {
      throws(() => {
        completeNow(null as unknown as OnCompletion<string>, () => 'value');
      }, 'Should throw when onCompletion is null');
    });
  });

  describe('completeNow edge cases', () => {
    it('should complete even if onCompletion callback throws', () => {
      const testError = new Error('callback error');
      const onCompletion: OnCompletion<string> = {
        onCompletion: (_completion: Completion<string>): void => {
          throw testError;
        }
      };

      throws(() => {
        completeNow(onCompletion, () => 'value');
      });
    });

    it('should work with empty string value', () => {
      let receivedCompletion: Completion<string> | null = null;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (completion: Completion<string>): void => {
          receivedCompletion = completion;
        }
      };

      const result = completeNow(onCompletion, () => '');

      strictEqual(result, '', 'Should return empty string');
      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<string>).getState(), 'SUCCEEDED', 'State should be SUCCEEDED');
      strictEqual((receivedCompletion as Completion<string>).getValue(), '', 'Value should be empty string');
    });

    it('should work with zero value', () => {
      let receivedCompletion: Completion<number> | null = null;
      const onCompletion: OnCompletion<number> = {
        onCompletion: (completion: Completion<number>): void => {
          receivedCompletion = completion;
        }
      };

      const result = completeNow(onCompletion, () => 0);

      strictEqual(result, 0, 'Should return zero');
      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<string>).getState(), 'SUCCEEDED', 'State should be SUCCEEDED');
      strictEqual((receivedCompletion as Completion<string>).getValue(), 0, 'Value should be zero');
    });

    it('should work with false value', () => {
      let receivedCompletion: Completion<boolean> | null = null;
      const onCompletion: OnCompletion<boolean> = {
        onCompletion: (completion: Completion<boolean>): void => {
          receivedCompletion = completion;
        }
      };

      const result = completeNow(onCompletion, () => false);

      strictEqual(result, false, 'Should return false');
      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<boolean>).getState(), 'SUCCEEDED', 'State should be SUCCEEDED');
      strictEqual((receivedCompletion as Completion<boolean>).getValue(), false, 'Value should be false');
    });

    it('should work with array value', () => {
      let receivedCompletion: Completion<number[]> | null = null;
      const onCompletion: OnCompletion<number[]> = {
        onCompletion: (completion: Completion<number[]>): void => {
          receivedCompletion = completion;
        }
      };

      const testArray = [1, 2, 3];
      const result = completeNow(onCompletion, () => testArray);

      strictEqual(result, testArray, 'Should return array');
      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<number[]>).getState(), 'SUCCEEDED', 'State should be SUCCEEDED');
      strictEqual((receivedCompletion as Completion<number[]>).getValue(), testArray, 'Value should be array');
    });
  });

  describe('completeNow completion always called', () => {
    it('should call onCompletion in finally block on success', () => {
      let callCount = 0;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (_completion: Completion<string>): void => {
          callCount++;
        }
      };

      completeNow(onCompletion, () => 'value');

      strictEqual(callCount, 1, 'onCompletion should be called exactly once');
    });

    it('should call onCompletion in finally block on failure', () => {
      let callCount = 0;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (_completion: Completion<string>): void => {
          callCount++;
        }
      };

      throws(() => {
        completeNow(onCompletion, () => {
          throw new Error('test');
        });
      });

      strictEqual(callCount, 1, 'onCompletion should be called exactly once even on failure');
    });
  });
});
