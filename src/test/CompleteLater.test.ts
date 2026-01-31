import { ok, strictEqual, throws } from "node:assert";

import { Completion } from "@jonloucks/concurrency-ts/api/Completion";
import { OnCompletion } from "@jonloucks/concurrency-ts/api/OnCompletion";

import { completeLater } from "../impl/CompleteLater.impl";

describe('CompleteLater Tests', () => {
  describe('completeLater with success', () => {
    it('should delegate to consumer when delegate succeeds', () => {
      let receivedOnCompletion: OnCompletion<string> | null = null;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (_completion: Completion<string>): void => {
          // Should not be called by completeLater
        }
      };

      const delegate = (oc: OnCompletion<string>): void => {
        receivedOnCompletion = oc;
      };

      completeLater(onCompletion, delegate);

      ok(receivedOnCompletion !== null, 'Delegate should receive onCompletion');
      strictEqual(receivedOnCompletion, onCompletion, 'Delegate should receive the original onCompletion');
    });

    it('should work with Consumer object with consume method', () => {
      let receivedOnCompletion: OnCompletion<number> | null = null;
      const onCompletion: OnCompletion<number> = {
        onCompletion: (_completion: Completion<number>): void => {
          // Should not be called by completeLater
        }
      };

      const consumer = {
        consume: (oc: OnCompletion<number>): void => {
          receivedOnCompletion = oc;
        }
      };

      completeLater(onCompletion, consumer);

      ok(receivedOnCompletion !== null, 'Consumer should receive onCompletion');
      strictEqual(receivedOnCompletion, onCompletion, 'Consumer should receive the original onCompletion');
    });

    it('should transfer ownership to delegate', () => {
      let delegateCalled = false;
      let completionCalled = false;

      const onCompletion: OnCompletion<string> = {
        onCompletion: (_completion: Completion<string>): void => {
          completionCalled = true;
        }
      };

      const delegate = (_oc: OnCompletion<string>): void => {
        delegateCalled = true;
        // Delegate receives ownership and should complete it later
      };

      completeLater(onCompletion, delegate);

      ok(delegateCalled, 'Delegate should be called');
      strictEqual(completionCalled, false, 'onCompletion should not be completed by completeLater');
    });

    it('should work with different types', () => {
      let receivedOnCompletion: OnCompletion<boolean> | null = null;
      const onCompletion: OnCompletion<boolean> = {
        onCompletion: (_completion: Completion<boolean>): void => {
          // Should not be called
        }
      };

      completeLater(onCompletion, (oc) => {
        receivedOnCompletion = oc;
      });

      ok(receivedOnCompletion !== null, 'Delegate should receive onCompletion');
      strictEqual(receivedOnCompletion, onCompletion, 'Should receive the correct onCompletion');
    });

    it('should work with object type', () => {
      type TestType = { name: string; value: number };
      let receivedOnCompletion: OnCompletion<TestType> | null = null;
      const onCompletion: OnCompletion<TestType> = {
        onCompletion: (_completion: Completion<TestType>): void => {
          // Should not be called
        }
      };

      completeLater(onCompletion, (oc) => {
        receivedOnCompletion = oc;
      });

      ok(receivedOnCompletion !== null, 'Delegate should receive onCompletion');
      strictEqual(receivedOnCompletion, onCompletion, 'Should receive the correct onCompletion');
    });
  });

  describe('completeLater with failure', () => {
    it('should complete with FAILED state when delegate throws', () => {
      let receivedCompletion: Completion<string> | null = null;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (completion: Completion<string>): void => {
          receivedCompletion = completion;
        }
      };

      const testError = new Error('delegate error');
      const delegate = (_oc: OnCompletion<string>): void => {
        throw testError;
      };

      throws(() => {
        completeLater(onCompletion, delegate);
      });

      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<string>).state, 'FAILED', 'State should be FAILED');
      strictEqual((receivedCompletion as Completion<string>).thrown, testError, 'Should have thrown error');
    });

    it('should complete with FAILED state when consumer throws', () => {
      let receivedCompletion: Completion<number> | null = null;
      const onCompletion: OnCompletion<number> = {
        onCompletion: (completion: Completion<number>): void => {
          receivedCompletion = completion;
        }
      };

      const testError = new Error('consumer error');
      const consumer = {
        consume: (_oc: OnCompletion<number>): void => {
          throw testError;
        }
      };

      throws(() => {
        completeLater(onCompletion, consumer);
      });

      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<number>).state, 'FAILED', 'State should be FAILED');
      strictEqual((receivedCompletion as Completion<number>).thrown, testError, 'Should have thrown error');
    });

    it('should complete with FAILED state when throwing string', () => {
      let receivedCompletion: Completion<string> | null = null;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (completion: Completion<string>): void => {
          receivedCompletion = completion;
        }
      };

      throws(() => {
        completeLater(onCompletion, (_oc) => {
          throw 'string error';
        });
      });

      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<string>).state, 'FAILED', 'State should be FAILED');
      strictEqual((receivedCompletion as Completion<string>).thrown, 'string error', 'Should have thrown string');
    });

    it('should complete with FAILED state when throwing custom object', () => {
      let receivedCompletion: Completion<string> | null = null;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (completion: Completion<string>): void => {
          receivedCompletion = completion;
        }
      };

      const customError = { code: 404, message: 'not found' };

      throws(() => {
        completeLater(onCompletion, (_oc) => {
          throw customError;
        });
      });

      ok(receivedCompletion !== null, 'Should have received completion');
      strictEqual((receivedCompletion as Completion<string>).state, 'FAILED', 'State should be FAILED');
      strictEqual((receivedCompletion as Completion<string>).thrown, customError, 'Should have thrown custom error');
    });
  });

  describe('completeLater validation', () => {
    it('should validate onCompletion parameter', () => {
      throws(() => {
        completeLater(null as unknown as OnCompletion<string>, (_oc) => {
          // Should not reach here
        });
      }, 'Should throw when onCompletion is null');
    });

    it('should validate delegate parameter', () => {
      let receivedCompletion: Completion<string> | null = null;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (completion: Completion<string>): void => {
          receivedCompletion = completion;
        }
      };

      throws(() => {
        completeLater(onCompletion, null as unknown as (oc: OnCompletion<string>) => void);
      });

      ok(receivedCompletion !== null, 'Should have received completion even on validation failure');
      strictEqual((receivedCompletion as Completion<string>).state, 'FAILED', 'State should be FAILED');
    });

    it('should validate delegate as object without consume method', () => {
      let receivedCompletion: Completion<string> | null = null;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (completion: Completion<string>): void => {
          receivedCompletion = completion;
        }
      };

      throws(() => {
        completeLater(onCompletion, {} as unknown as (oc: OnCompletion<string>) => void);
      });

      ok(receivedCompletion !== null, 'Should have received completion even on validation failure');
      strictEqual((receivedCompletion as Completion<string>).state, 'FAILED', 'State should be FAILED');
    });
  });

  describe('completeLater edge cases', () => {
    it('should complete with FAILED even if onCompletion callback throws', () => {
      const callbackError = new Error('callback error');
      const delegateError = new Error('delegate error');
      
      const onCompletion: OnCompletion<string> = {
        onCompletion: (_completion: Completion<string>): void => {
          throw callbackError;
        }
      };

      throws(() => {
        completeLater(onCompletion, (_oc) => {
          throw delegateError;
        });
      }); // The callback error is thrown after delegate error
    });

    it('should not complete if delegation succeeds', () => {
      let completionCallCount = 0;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (_completion: Completion<string>): void => {
          completionCallCount++;
        }
      };

      completeLater(onCompletion, (_oc) => {
        // Successful delegation
      });

      strictEqual(completionCallCount, 0, 'onCompletion should not be called when delegation succeeds');
    });

    it('should complete only once even if delegate succeeds', () => {
      let completionCallCount = 0;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (_completion: Completion<string>): void => {
          completionCallCount++;
        }
      };

      completeLater(onCompletion, (oc) => {
        // Delegate successfully receives ownership
        // Even if delegate completes it here, completeLater shouldn't double-complete
        oc.onCompletion({ 
          state: 'SUCCEEDED',
          value: 'test',
          thrown: undefined,
          promise: undefined
        } as Completion<string>);
      });

      strictEqual(completionCallCount, 1, 'onCompletion should be called exactly once');
    });
  });

  describe('completeLater ownership transfer', () => {
    it('should allow delegate to complete the onCompletion later', () => {
      let storedOnCompletion: OnCompletion<string> | null = null;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (_completion: Completion<string>): void => {
          // Will be called by delegate later
        }
      };

      completeLater(onCompletion, (oc) => {
        // Store for later use
        storedOnCompletion = oc;
      });

      ok(storedOnCompletion !== null, 'Delegate should have stored onCompletion');
      strictEqual(storedOnCompletion, onCompletion, 'Should have stored the correct onCompletion');
    });

    it('should not interfere with delegate completing asynchronously', () => {
      let completionReceived = false;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (_completion: Completion<string>): void => {
          completionReceived = true;
        }
      };

      let delegateCompleter: OnCompletion<string> | null = null;

      completeLater(onCompletion, (oc) => {
        delegateCompleter = oc;
      });

      strictEqual(completionReceived, false, 'Should not have completed yet');
      ok(delegateCompleter !== null, 'Delegate should have the completer');
    });
  });

  describe('completeLater completion behavior', () => {
    it('should complete in finally block on delegate failure', () => {
      let callCount = 0;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (_completion: Completion<string>): void => {
          callCount++;
        }
      };

      throws(() => {
        completeLater(onCompletion, (_oc) => {
          throw new Error('test');
        });
      });

      strictEqual(callCount, 1, 'onCompletion should be called exactly once on failure');
    });

    it('should not complete in finally block on delegate success', () => {
      let callCount = 0;
      const onCompletion: OnCompletion<string> = {
        onCompletion: (_completion: Completion<string>): void => {
          callCount++;
        }
      };

      completeLater(onCompletion, (_oc) => {
        // Success - no throw
      });

      strictEqual(callCount, 0, 'onCompletion should not be called when delegation succeeds');
    });
  });
});
