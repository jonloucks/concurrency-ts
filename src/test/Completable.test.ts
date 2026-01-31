import { ok, strictEqual, throws } from "node:assert";

import { Completable, Config as CompletableConfig, guard } from "@jonloucks/concurrency-ts/api/Completable";
import { Completion } from "@jonloucks/concurrency-ts/api/Completion";
import { CONTRACTS, isPresent } from "@jonloucks/contracts-ts";
import { assertGuard, mockDuck } from "./helper.test";

import { create as createCompletable } from "../impl/Completable.impl";
import { create as createCompletion } from "../impl/Completion.impl";

const FUNCTION_NAMES: (string | symbol)[] = [
  'open',
  'notifyState',
  'notifyValue',
  'getCompletion',
  'isCompleted',
  'onCompletion',
  'notify'
];

describe('Completable Tests', () => {
  it('isCompletable should return true for Completable', () => {
    const completable: Completable<number> = mockDuck<Completable<number>>(...FUNCTION_NAMES);
    ok(guard(completable), 'Completable should return true');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);

describe('Completable Implementation Tests', () => {
  let completable: Completable<string>;
  let config: CompletableConfig<string>;

  beforeEach(() => {
    config = {
      contracts: CONTRACTS
    };
    completable = createCompletable(config);
  });

  it('should create completable with valid config', () => {
    ok(isPresent(completable), 'Completable should be created');
  });

  it('should have open method', () => {
    ok(isPresent(completable.open), 'Completable should have open method');
    ok(typeof completable.open === 'function', 'open should be a function');
  });

  it('should have notifyState method', () => {
    ok(isPresent(completable.notifyState), 'Completable should have notifyState method');
    ok(typeof completable.notifyState === 'function', 'notifyState should be a function');
  });

  it('should have notifyValue method', () => {
    ok(isPresent(completable.notifyValue), 'Completable should have notifyValue method');
    ok(typeof completable.notifyValue === 'function', 'notifyValue should be a function');
  });

  it('should have getCompletion method', () => {
    ok(isPresent(completable.getCompletion), 'Completable should have getCompletion method');
    ok(typeof completable.getCompletion === 'function', 'getCompletion should be a function');
  });

  it('should have isCompleted method', () => {
    ok(isPresent(completable.isCompleted), 'Completable should have isCompleted method');
    ok(typeof completable.isCompleted === 'function', 'isCompleted should be a function');
  });

  it('should have onCompletion method', () => {
    ok(isPresent(completable.onCompletion), 'Completable should have onCompletion method');
    ok(typeof completable.onCompletion === 'function', 'onCompletion should be a function');
  });

  it('should have notify method', () => {
    ok(isPresent(completable.notify), 'Completable should have notify method');
    ok(typeof completable.notify === 'function', 'notify should be a function');
  });
});

describe('Completable State Management Tests', () => {
  let completable: Completable<string>;

  beforeEach(() => {
    completable = createCompletable({
      contracts: CONTRACTS
    });
  });

  it('should be initially incomplete', () => {
    ok(!completable.isCompleted(), 'Completable should be incomplete initially');
  });

  it('should return completion state waitable', () => {
    const stateWaitable = completable.notifyState();
    ok(isPresent(stateWaitable), 'notifyState should return a waitable');
  });

  it('should return value waitable', () => {
    const valueWaitable = completable.notifyValue();
    ok(isPresent(valueWaitable), 'notifyValue should return a waitable');
  });
});

describe('Completable Config Variants Tests', () => {
  it('should create completable with required contracts only', () => {
    const completable = createCompletable({
      contracts: CONTRACTS
    });
    ok(isPresent(completable), 'Completable should be created with contracts only');
  });

  it('should create completable with contracts and initial value', () => {
    const initialValue = 'initial-value';
    const completable = createCompletable({
      contracts: CONTRACTS,
      initialValue
    });
    ok(isPresent(completable), 'Completable should be created with initial value');
  });

  it('should create completable with null initial value', () => {
    const completable = createCompletable({
      contracts: CONTRACTS,
      initialValue: null
    });
    ok(isPresent(completable), 'Completable should be created with null initial value');
  });

  it('should create completable with undefined initial value', () => {
    const completable = createCompletable({
      contracts: CONTRACTS,
      initialValue: undefined
    });
    ok(isPresent(completable), 'Completable should be created with undefined initial value');
  });
});

describe('Completable Generic Type Tests', () => {
  it('should create completable for string type', () => {
    const completable = createCompletable<string>({
      contracts: CONTRACTS,
      initialValue: 'string-value'
    });
    ok(isPresent(completable), 'Completable<string> should be created');
  });

  it('should create completable for number type', () => {
    const completable = createCompletable<number>({
      contracts: CONTRACTS,
      initialValue: 42
    });
    ok(isPresent(completable), 'Completable<number> should be created');
  });

  it('should create completable for boolean type', () => {
    const completable = createCompletable<boolean>({
      contracts: CONTRACTS,
      initialValue: true
    });
    ok(isPresent(completable), 'Completable<boolean> should be created');
  });

  it('should create completable for object type', () => {
    const obj = { key: 'value' };
    const completable = createCompletable({
      contracts: CONTRACTS,
      initialValue: obj
    });
    ok(isPresent(completable), 'Completable<object> should be created');
  });

  it('should create completable for array type', () => {
    const arr = [1, 2, 3];
    const completable = createCompletable({
      contracts: CONTRACTS,
      initialValue: arr
    });
    ok(isPresent(completable), 'Completable<array> should be created');
  });
});

describe('Completable Multiple Instances Tests', () => {
  it('should create multiple independent completable instances', () => {
    const completable1 = createCompletable<string>({
      contracts: CONTRACTS
    });
    const completable2 = createCompletable<number>({
      contracts: CONTRACTS
    });
    const completable3 = createCompletable<boolean>({
      contracts: CONTRACTS
    });

    ok(isPresent(completable1), 'First completable should be created');
    ok(isPresent(completable2), 'Second completable should be created');
    ok(isPresent(completable3), 'Third completable should be created');

    ok(!completable1.isCompleted(), 'First completable should be incomplete');
    ok(!completable2.isCompleted(), 'Second completable should be incomplete');
    ok(!completable3.isCompleted(), 'Third completable should be incomplete');
  });
});

describe('Completable Completion Lifecycle Tests', () => {
  let completable: Completable<string>;

  beforeEach(() => {
    completable = createCompletable({
      contracts: CONTRACTS
    });
  });

  it('should have completion initially null', () => {
    const completion = completable.getCompletion();
    strictEqual(completion, null, 'Initial completion should be null');
  });

  it('should maintain completion state', () => {
    const completion1 = completable.getCompletion();
    const completion2 = completable.getCompletion();
    strictEqual(completion1, completion2, 'Completion should be consistent');
  });
});

describe('Completable Waitable Integration Tests', () => {
  let completable: Completable<string>;

  beforeEach(() => {
    completable = createCompletable({
      contracts: CONTRACTS
    });
  });

  it('state waitable should have notifyWhile method', () => {
    const stateWaitable = completable.notifyState();
    ok(isPresent(stateWaitable.notifyWhile), 'State waitable should have notifyWhile method');
  });

  it('value waitable should have notifyWhile method', () => {
    const valueWaitable = completable.notifyValue();
    ok(isPresent(valueWaitable.notifyWhile), 'Value waitable should have notifyWhile method');
  });
});

describe('Completable Open Interface Tests', () => {
  let completable: Completable<string>;

  beforeEach(() => {
    completable = createCompletable({
      contracts: CONTRACTS
    });
  });

  it('open method should return AutoClose', () => {
    const autoClose = completable.open();
    ok(isPresent(autoClose), 'open should return AutoClose');
    ok(isPresent(autoClose.close), 'AutoClose should have close method');
  });

  it('open method should be callable multiple times', () => {
    const autoClose1 = completable.open();
    const autoClose2 = completable.open();
    ok(isPresent(autoClose1), 'First open call should succeed');
    ok(isPresent(autoClose2), 'Second open call should succeed');
  });
});

describe('Completable AutoClose Behavior Tests', () => {
  let completable: Completable<string>;

  beforeEach(() => {
    completable = createCompletable({
      contracts: CONTRACTS
    });
  });

  it('should close AutoClose without error', () => {
    const autoClose = completable.open();
    ok(isPresent(autoClose), 'AutoClose should be present');
    autoClose.close();
    ok(true, 'Close should complete without error');
  });

  it('should handle multiple open and close cycles', () => {
    const autoClose1 = completable.open();
    autoClose1.close();

    const autoClose2 = completable.open();
    autoClose2.close();

    const autoClose3 = completable.open();
    ok(isPresent(autoClose3), 'Third open should succeed');
  });

  it('should allow multiple simultaneous opens', () => {
    const autoClose1 = completable.open();
    const autoClose2 = completable.open();
    const autoClose3 = completable.open();

    ok(isPresent(autoClose1), 'First AutoClose should be present');
    ok(isPresent(autoClose2), 'Second AutoClose should be present');
    ok(isPresent(autoClose3), 'Third AutoClose should be present');

    autoClose1.close();
    autoClose2.close();
    autoClose3.close();
  });

  it('should be safe to close same AutoClose multiple times', () => {
    const autoClose = completable.open();
    autoClose.close();
    autoClose.close();
    autoClose.close();
    ok(true, 'Multiple close calls should not error');
  });
});

describe('Completable State Notification Tests', () => {
  let completable: Completable<string>;

  beforeEach(() => {
    completable = createCompletable({
      contracts: CONTRACTS
    });
  });

  it('should return consistent state waitable references', () => {
    const stateWaitable1 = completable.notifyState();
    const stateWaitable2 = completable.notifyState();
    strictEqual(stateWaitable1, stateWaitable2, 'State waitable should be the same instance');
  });

  it('should return consistent value waitable references', () => {
    const valueWaitable1 = completable.notifyValue();
    const valueWaitable2 = completable.notifyValue();
    strictEqual(valueWaitable1, valueWaitable2, 'Value waitable should be the same instance');
  });

  it('state waitable should have notifyWhile method', () => {
    const stateWaitable = completable.notifyState();
    ok(isPresent(stateWaitable.notifyWhile), 'State waitable should have notifyWhile method');
    ok(typeof stateWaitable.notifyWhile === 'function', 'notifyWhile should be a function');
  });

  it('value waitable should have notifyWhile method', () => {
    const valueWaitable = completable.notifyValue();
    ok(isPresent(valueWaitable.notifyWhile), 'Value waitable should have notifyWhile method');
    ok(typeof valueWaitable.notifyWhile === 'function', 'notifyWhile should be a function');
  });
});

describe('Completable Value Initialization Tests', () => {
  it('should create completable with string value', () => {
    const testValue = 'test-string';
    const completable = createCompletable<string>({
      contracts: CONTRACTS,
      initialValue: testValue
    });
    ok(isPresent(completable), 'Completable with string should be created');
  });

  it('should create completable with number value', () => {
    const testValue = 123.456;
    const completable = createCompletable<number>({
      contracts: CONTRACTS,
      initialValue: testValue
    });
    ok(isPresent(completable), 'Completable with number should be created');
  });

  it('should create completable with complex object', () => {
    const testValue = { name: 'test', count: 42, nested: { value: true } };
    const completable = createCompletable({
      contracts: CONTRACTS,
      initialValue: testValue
    });
    ok(isPresent(completable), 'Completable with complex object should be created');
  });

  it('should create completable without initial value', () => {
    const completable = createCompletable<string>({
      contracts: CONTRACTS
    });
    ok(isPresent(completable), 'Completable without initial value should be created');
    const completion = completable.getCompletion();
    strictEqual(completion, null, 'Completion should be null without initial value');
  });
});

describe('Completable Integration Tests', () => {
  it('should maintain state consistency across operations', () => {
    const completable = createCompletable<number>({
      contracts: CONTRACTS,
      initialValue: 42
    });

    const autoClose = completable.open();
    ok(!completable.isCompleted(), 'Should remain incomplete after open');

    const stateWaitable = completable.notifyState();
    ok(isPresent(stateWaitable), 'Should have state waitable');

    const valueWaitable = completable.notifyValue();
    ok(isPresent(valueWaitable), 'Should have value waitable');

    const completion = completable.getCompletion();
    strictEqual(completion, null, 'Completion should still be null');

    autoClose.close();
    ok(!completable.isCompleted(), 'Should remain incomplete after close');
  });

  it('should support concurrent access patterns', () => {
    const completable = createCompletable<string>({
      contracts: CONTRACTS
    });

    // Simulate concurrent access
    const autoClose1 = completable.open();
    const state1 = completable.notifyState();
    const value1 = completable.notifyValue();
    const autoClose2 = completable.open();
    const state2 = completable.notifyState();
    const value2 = completable.notifyValue();

    ok(isPresent(state1), 'First state should be present');
    ok(isPresent(state2), 'Second state should be present');
    ok(isPresent(value1), 'First value should be present');
    ok(isPresent(value2), 'Second value should be present');

    strictEqual(state1, state2, 'States should be same instance');
    strictEqual(value1, value2, 'Values should be same instance');

    autoClose1.close();
    autoClose2.close();
  });
});

describe('Completable Edge Cases Tests', () => {
  it('should handle empty string as initial value', () => {
    const completable = createCompletable<string>({
      contracts: CONTRACTS,
      initialValue: ''
    });
    ok(isPresent(completable), 'Should accept empty string');
  });

  it('should handle zero as initial value', () => {
    const completable = createCompletable<number>({
      contracts: CONTRACTS,
      initialValue: 0
    });
    ok(isPresent(completable), 'Should accept zero');
  });

  it('should handle false as initial value', () => {
    const completable = createCompletable<boolean>({
      contracts: CONTRACTS,
      initialValue: false
    });
    ok(isPresent(completable), 'Should accept false');
  });

  it('should handle empty array as initial value', () => {
    const completable = createCompletable<number[]>({
      contracts: CONTRACTS,
      initialValue: []
    });
    ok(isPresent(completable), 'Should accept empty array');
  });

  it('should handle empty object as initial value', () => {
    const completable = createCompletable<Record<string, never>>({
      contracts: CONTRACTS,
      initialValue: {}
    });
    ok(isPresent(completable), 'Should accept empty object');
  });
});

describe('Completable Comprehensive Coverage Tests', () => {
  it('should test all public methods in sequence', () => {
    const completable = createCompletable<number>({
      contracts: CONTRACTS,
      initialValue: 100
    });

    // Test open
    const autoClose = completable.open();
    ok(isPresent(autoClose), 'open() should return AutoClose');

    // Test notifyState
    const stateNotify = completable.notifyState();
    ok(isPresent(stateNotify), 'notifyState() should return WaitableNotify');

    // Test notifyValue  
    const valueNotify = completable.notifyValue();
    ok(isPresent(valueNotify), 'notifyValue() should return WaitableNotify');

    // Test getCompletion
    const completion = completable.getCompletion();
    strictEqual(completion, null, 'getCompletion() should return null initially');

    // Test isCompleted
    const completed = completable.isCompleted();
    strictEqual(completed, false, 'isCompleted() should return false initially');

    // Test AutoClose.close
    autoClose.close();
    ok(true, 'AutoClose.close() should execute without error');

    // Verify state after close
    ok(!completable.isCompleted(), 'Should still be incomplete after close');
  });

  it('should test creation with all config options', () => {
    const completable = createCompletable<string>({
      contracts: CONTRACTS,
      initialValue: 'test'
    });

    ok(isPresent(completable), 'Completable created with all options');
    ok(isPresent(completable.open), 'Has open method');
    ok(isPresent(completable.notifyState), 'Has notifyState method');
    ok(isPresent(completable.notifyValue), 'Has notifyValue method');
    ok(isPresent(completable.getCompletion), 'Has getCompletion method');
    ok(isPresent(completable.isCompleted), 'Has isCompleted method');
    ok(isPresent(completable.notify), 'Has notify method');
    ok(isPresent(completable.onCompletion), 'Has onCompletion method');
  });

  it('should handle rapid open/close cycles', () => {
    const completable = createCompletable({
      contracts: CONTRACTS
    });

    for (let i = 0; i < 10; i++) {
      const autoClose = completable.open();
      ok(isPresent(autoClose), `Open ${i} should succeed`);
      autoClose.close();
    }

    ok(!completable.isCompleted(), 'Should remain incomplete after cycles');
  });

  it('should maintain correct state with nested operations', () => {
    const completable = createCompletable<string>({
      contracts: CONTRACTS,
      initialValue: 'nested-test'
    });

    const autoClose1 = completable.open();
    const state1 = completable.notifyState();
    const value1 = completable.notifyValue();

    const autoClose2 = completable.open();
    const completion1 = completable.getCompletion();
    const isCompleted1 = completable.isCompleted();

    ok(isPresent(state1), 'State 1 present');
    ok(isPresent(value1), 'Value 1 present');
    strictEqual(completion1, null, 'Completion is null');
    strictEqual(isCompleted1, false, 'Not completed');

    autoClose1.close();

    const state2 = completable.notifyState();
    const value2 = completable.notifyValue();
    strictEqual(state1, state2, 'States are same');
    strictEqual(value1, value2, 'Values are same');

    autoClose2.close();
  });
});

describe('Completable notify() Method Tests', () => {
  it('should register observer via notify and receive completion', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();

    let receivedCompletion: Completion<string> | null = null;
    const observer = {
      onCompletion: (completion: Completion<string>): void => {
        receivedCompletion = completion;
      }
    };

    const closeObserver = completable.notify(observer);
    const testCompletion = createCompletion<string>({ state: 'SUCCEEDED', value: 'test' });
    completable.onCompletion(testCompletion);

    ok(receivedCompletion !== null, 'Observer should receive completion');
    strictEqual((receivedCompletion as Completion<string>).getState(), 'SUCCEEDED', 'Check state');
    strictEqual((receivedCompletion as Completion<string>).getValue(), 'test', 'Check value');

    closeObserver.close();
    autoClose.close();
  });

  it('should remove observer when AutoClose is called', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();

    let callCount = 0;
    const observer = {
      onCompletion: (_completion: Completion<string>): void => {
        callCount++;
      }
    };

    const closeObserver = completable.notify(observer);
    completable.onCompletion(createCompletion<string>({ state: 'SUCCEEDED', value: 'test1' }));
    strictEqual(callCount, 1, 'Observer called once');

    closeObserver.close();
    completable.onCompletion(createCompletion<string>({ state: 'SUCCEEDED', value: 'test2' }));
    strictEqual(callCount, 1, 'Observer not called after close');

    autoClose.close();
  });

  it('should handle multiple observers', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();

    let callCount1 = 0;
    let callCount2 = 0;
    const observer1 = {
      onCompletion: (_completion: Completion<string>): void => {
        callCount1++;
      }
    };
    const observer2 = {
      onCompletion: (_completion: Completion<string>): void => {
        callCount2++;
      }
    };

    const close1 = completable.notify(observer1);
    const close2 = completable.notify(observer2);

    completable.onCompletion(createCompletion<string>({ state: 'SUCCEEDED', value: 'test' }));

    strictEqual(callCount1, 1, 'Observer 1 called');
    strictEqual(callCount2, 1, 'Observer 2 called');

    close1.close();
    close2.close();
    autoClose.close();
  });

  it('should not notify observer after it has been closed', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();

    let callCount = 0;
    const observer = {
      onCompletion: (_completion: Completion<string>): void => {
        callCount++;
      }
    };

    const closeObserver = completable.notify(observer);
    closeObserver.close();

    completable.onCompletion(createCompletion<string>({ state: 'SUCCEEDED', value: 'test' }));
    strictEqual(callCount, 0, 'Observer not called after close');

    autoClose.close();
  });

  it('should handle observer close being called multiple times', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();

    let callCount = 0;
    const observer = {
      onCompletion: (_completion: Completion<string>): void => {
        callCount++;
      }
    };

    const closeObserver = completable.notify(observer);
    closeObserver.close();
    closeObserver.close(); // Second close should be no-op

    completable.onCompletion(createCompletion<string>({ state: 'SUCCEEDED', value: 'test' }));
    strictEqual(callCount, 0, 'Observer not called after close');

    autoClose.close();
  });
});

describe('Completable onCompletion() Method Tests', () => {
  it('should set completion and notify observers', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();

    let receivedCompletion: Completion<string> | null = null;
    const observer = {
      onCompletion: (completion: Completion<string>): void => {
        receivedCompletion = completion;
      }
    };

    completable.notify(observer);
    const completion = createCompletion<string>({ state: 'SUCCEEDED', value: 'test' });
    completable.onCompletion(completion);

    ok(receivedCompletion !== null, 'Observer received completion');
    strictEqual((receivedCompletion as Completion<string>).getState(), 'SUCCEEDED', 'Check state');

    autoClose.close();
  });

  it('should handle failed completion', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();

    let receivedCompletion: Completion<string> | null = null;
    const observer = {
      onCompletion: (completion: Completion<string>): void => {
        receivedCompletion = completion;
      }
    };

    completable.notify(observer);
    const error = new Error('test error');
    completable.onCompletion(createCompletion<string>({ state: 'FAILED', thrown: error }));

    ok(receivedCompletion !== null, 'Observer received completion');
    strictEqual((receivedCompletion as Completion<string>).getState(), 'FAILED', 'Check failed state');

    autoClose.close();
  });

  it('should handle cancelled completion', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();

    let receivedCompletion: Completion<string> | null = null;
    const observer = {
      onCompletion: (completion: Completion<string>): void => {
        receivedCompletion = completion;
      }
    };

    completable.notify(observer);
    completable.onCompletion(createCompletion<string>({ state: 'CANCELLED' }));

    ok(receivedCompletion !== null, 'Observer received completion');
    strictEqual((receivedCompletion as Completion<string>).getState(), 'CANCELLED', 'Check cancelled state');

    autoClose.close();
  });

  it('should notthrow when setting completion twice', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();

    completable.onCompletion(createCompletion<string>({ state: 'SUCCEEDED', value: 'first' }));

    // Second call should be a no-op (doesn't throw)
    completable.onCompletion(createCompletion<string>({ state: 'SUCCEEDED', value: 'second' }));

    // Completion should still be first
    const completion = completable.getCompletion();
    strictEqual(completion?.getValue(), 'first', 'Should keep first completion');

    autoClose.close();
  });

  it('should not throw when setting completion after failed', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();

    const error = new Error('test error');
    completable.onCompletion(createCompletion<string>({ state: 'FAILED', thrown: error }));

    // Second call should be a no-op (doesn't throw)
    completable.onCompletion(createCompletion<string>({ state: 'SUCCEEDED', value: 'second' }));

    // Completion should still be failed
    const completion = completable.getCompletion();
    strictEqual(completion?.getState(), 'FAILED', 'Should keep failed completion');

    autoClose.close();
  });

  it('should not throw when setting completion after cancelled', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();

    completable.onCompletion(createCompletion<string>({ state: 'CANCELLED' }));

    // Second call should be a no-op (doesn't throw)
    completable.onCompletion(createCompletion<string>({ state: 'SUCCEEDED', value: 'second' }));

    // Completion should still be cancelled
    const completion = completable.getCompletion();
    strictEqual(completion?.getState(), 'CANCELLED', 'Should keep cancelled completion');

    autoClose.close();
  });

  it('should notify multiple observers in order', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();

    const callOrder: number[] = [];
    const observer1 = {
      onCompletion: (_completion: Completion<string>): void => {
        callOrder.push(1);
      }
    };
    const observer2 = {
      onCompletion: (_completion: Completion<string>): void => {
        callOrder.push(2);
      }
    };
    const observer3 = {
      onCompletion: (_completion: Completion<string>): void => {
        callOrder.push(3);
      }
    };

    completable.notify(observer1);
    completable.notify(observer2);
    completable.notify(observer3);

    completable.onCompletion(createCompletion<string>({ state: 'SUCCEEDED', value: 'test' }));

    strictEqual(callOrder.length, 3, 'All observers called');
    strictEqual(callOrder[0], 1, 'Observer 1 called first');
    strictEqual(callOrder[1], 2, 'Observer 2 called second');
    strictEqual(callOrder[2], 3, 'Observer 3 called third');

    autoClose.close();
  });

  it('should handle observer that throws during notification', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();

    const observer1 = {
      onCompletion: (_completion: Completion<string>): void => {
        throw new Error('Observer error');
      }
    };
    const observer2 = {
      onCompletion: (_completion: Completion<string>): void => {
        // Observer 2 should still be notified
      }
    };

    completable.notify(observer1);
    completable.notify(observer2);

    // Even if observer1 throws, observer2 should still be notified
    throws(
      () => completable.onCompletion(createCompletion<string>({ state: 'SUCCEEDED', value: 'test' })),
      'Should propagate observer error'
    );

    autoClose.close();
  });

  it('should notify new observers of existing completion', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();

    // Set completion first
    completable.onCompletion(createCompletion<string>({ state: 'SUCCEEDED', value: 'test' }));

    // Now add observer - it should be notified immediately
    let receivedCompletion: Completion<string> | null = null;
    const observer = {
      onCompletion: (completion: Completion<string>): void => {
        receivedCompletion = completion;
      }
    };

    completable.notify(observer);

    ok(receivedCompletion !== null, 'New observer should be notified immediately');
    strictEqual((receivedCompletion as Completion<string>).getState(), 'SUCCEEDED', 'Check state');
    strictEqual((receivedCompletion as Completion<string>).getValue(), 'test', 'Check value');

    autoClose.close();
  });

  it('should throw when trying to complete after close', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();
    
    // Close the completable
    autoClose.close();

    // Now try to set completion - should throw
    throws(
      () => completable.onCompletion(createCompletion<string>({ state: 'SUCCEEDED', value: 'test' })),
      'Should throw when completing after close'
    );
  });

  it('should not notify observer when observer is closed before notification', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();

    let callCount = 0;
    const observer = {
      onCompletion: (_completion: Completion<string>): void => {
        callCount++;
      }
    };

    const closeObserver = completable.notify(observer);
    
    // Close observer before setting completion
    closeObserver.close();
    
    // Now complete - observer should not be called
    completable.onCompletion(createCompletion<string>({ state: 'SUCCEEDED', value: 'test' }));
    
    strictEqual(callCount, 0, 'Observer should not be called after close');

    autoClose.close();
  });

  it('should handle multiple notification registrations and proper cleanup', () => {
    const completable = createCompletable<string>({ contracts: CONTRACTS });
    const autoClose = completable.open();

    let calls: string[] = [];
    const observer1 = {
      onCompletion: (_completion: Completion<string>): void => {
        calls.push('observer1');
      }
    };
    const observer2 = {
      onCompletion: (_completion: Completion<string>): void => {
        calls.push('observer2');
      }
    };

    const close1 = completable.notify(observer1);
    const close2 = completable.notify(observer2);
    
    // Close first observer
    close1.close();
    
    // Now complete - only observer2 should be called
    completable.onCompletion(createCompletion<string>({ state: 'SUCCEEDED', value: 'test' }));
    
    strictEqual(calls.length, 1, 'Only one observer called');
    strictEqual(calls[0], 'observer2', 'Observer2 called');

    close2.close();
    autoClose.close();
  });
});

