import { ok, strictEqual } from "node:assert";

import { Completion, Config, guard } from "@jonloucks/concurrency-ts/api/Completion";
import { isPresent } from "@jonloucks/contracts-ts";
import { assertGuard, mockDuck } from "./helper.test";

import { create as createCompletion } from "../impl/Completion.impl";

const FUNCTION_NAMES : (string|symbol)[] = [
  'getState',
  'getThrown',
  'getValue',
  'getPromise',
  'isCompleted'
];

describe('isCompletion Tests', () => {
  it('isCompletion should return true for Completion', () => {
    const completion: Completion<number> = mockDuck<Completion<number>>(...FUNCTION_NAMES);
    ok(guard(completion), 'Completion should return true');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);

describe('Completion Exports', () => {
  it('should export Completion and Config', () => {
    const config: Config<number> = mockDuck<Config<number>>(...FUNCTION_NAMES);
    const completion: Completion<number> = mockDuck<Completion<number>>(...FUNCTION_NAMES);
    ok(config !== undefined, 'Config should be defined');
    ok(completion !== undefined, 'Completion should be defined');
  });
});

describe('Completion Implementation Tests', () => {
  it('should create completion with PENDING state', () => {
    const completion = createCompletion<string>({ state: 'PENDING' });
    ok(isPresent(completion), 'Completion should be created');
    strictEqual(completion.getState(), 'PENDING', 'State should be PENDING');
  });

  it('should have getState method', () => {
    const completion = createCompletion({ state: 'PENDING' });
    ok(isPresent(completion.getState), 'Should have getState method');
    ok(typeof completion.getState === 'function', 'getState should be a function');
  });

  it('should have getValue method', () => {
    const completion = createCompletion({ state: 'PENDING' });
    ok(isPresent(completion.getValue), 'Should have getValue method');
    ok(typeof completion.getValue === 'function', 'getValue should be a function');
  });

  it('should have getThrown method', () => {
    const completion = createCompletion({ state: 'PENDING' });
    ok(isPresent(completion.getThrown), 'Should have getThrown method');
    ok(typeof completion.getThrown === 'function', 'getThrown should be a function');
  });

  it('should have getPromise method', () => {
    const completion = createCompletion({ state: 'PENDING' });
    ok(isPresent(completion.getPromise), 'Should have getPromise method');
    ok(typeof completion.getPromise === 'function', 'getPromise should be a function');
  });

  it('should have isCompleted method', () => {
    const completion = createCompletion({ state: 'PENDING' });
    ok(isPresent(completion.isCompleted), 'Should have isCompleted method');
    ok(typeof completion.isCompleted === 'function', 'isCompleted should be a function');
  });
});

describe('Completion State Tests', () => {
  it('should return PENDING state when created with PENDING', () => {
    const completion = createCompletion({ state: 'PENDING' });
    strictEqual(completion.getState(), 'PENDING', 'State should be PENDING');
  });

  it('should return SUCCEEDED state when created with SUCCEEDED', () => {
    const completion = createCompletion({ state: 'SUCCEEDED' });
    strictEqual(completion.getState(), 'SUCCEEDED', 'State should be SUCCEEDED');
  });

  it('should return FAILED state when created with FAILED', () => {
    const completion = createCompletion({ state: 'FAILED' });
    strictEqual(completion.getState(), 'FAILED', 'State should be FAILED');
  });

  it('should return CANCELLED state when created with CANCELLED', () => {
    const completion = createCompletion({ state: 'CANCELLED' });
    strictEqual(completion.getState(), 'CANCELLED', 'State should be CANCELLED');
  });
});

describe('Completion Completion Status Tests', () => {
  it('should be incomplete when state is PENDING', () => {
    const completion = createCompletion({ state: 'PENDING' });
    strictEqual(completion.isCompleted(), false, 'PENDING should be incomplete');
  });

  it('should be completed when state is SUCCEEDED', () => {
    const completion = createCompletion({ state: 'SUCCEEDED' });
    strictEqual(completion.isCompleted(), true, 'SUCCEEDED should be completed');
  });

  it('should be completed when state is FAILED', () => {
    const completion = createCompletion({ state: 'FAILED' });
    strictEqual(completion.isCompleted(), true, 'FAILED should be completed');
  });

  it('should be completed when state is CANCELLED', () => {
    const completion = createCompletion({ state: 'CANCELLED' });
    strictEqual(completion.isCompleted(), true, 'CANCELLED should be completed');
  });
});

describe('Completion Value Tests', () => {
  it('should return null for value when not provided', () => {
    const completion = createCompletion<string>({ state: 'PENDING' });
    strictEqual(completion.getValue(), undefined, 'Value should be undefined');
  });

  it('should return value when provided', () => {
    const testValue = 'test-value';
    const completion = createCompletion<string>({ state: 'PENDING', value: testValue });
    strictEqual(completion.getValue(), testValue, 'Value should match');
  });

  it('should return null value when explicitly set', () => {
    const completion = createCompletion<string>({ state: 'PENDING', value: null });
    strictEqual(completion.getValue(), null, 'Value should be null');
  });

  it('should return number value', () => {
    const completion = createCompletion<number>({ state: 'SUCCEEDED', value: 42 });
    strictEqual(completion.getValue(), 42, 'Value should be 42');
  });

  it('should return boolean value', () => {
    const completion = createCompletion<boolean>({ state: 'SUCCEEDED', value: true });
    strictEqual(completion.getValue(), true, 'Value should be true');
  });

  it('should return object value', () => {
    const obj = { key: 'value' };
    const completion = createCompletion({ state: 'SUCCEEDED', value: obj });
    strictEqual(completion.getValue(), obj, 'Value should be the same object');
  });

  it('should return array value', () => {
    const arr = [1, 2, 3];
    const completion = createCompletion({ state: 'SUCCEEDED', value: arr });
    strictEqual(completion.getValue(), arr, 'Value should be the same array');
  });
});

describe('Completion Thrown Exception Tests', () => {
  it('should return undefined for thrown when not provided', () => {
    const completion = createCompletion({ state: 'PENDING' });
    strictEqual(completion.getThrown(), undefined, 'Thrown should be undefined');
  });

  it('should return thrown error when provided', () => {
    const error = new Error('test-error');
    const completion = createCompletion({ state: 'FAILED', thrown: error });
    strictEqual(completion.getThrown(), error, 'Thrown should match');
  });

  it('should return thrown with Error instance', () => {
    const error = new Error('custom error');
    const completion = createCompletion({ state: 'FAILED', thrown: error });
    ok(completion.getThrown() instanceof Error, 'Thrown should be Error instance');
  });

  it('should return thrown with custom throwable', () => {
    const throwable = { message: 'custom-error' };
    const completion = createCompletion({ state: 'FAILED', thrown: throwable });
    strictEqual(completion.getThrown(), throwable, 'Thrown should be custom object');
  });
});

describe('Completion Promise Tests', () => {
  it('should return undefined for promise when not provided', () => {
    const completion = createCompletion({ state: 'PENDING' });
    strictEqual(completion.getPromise(), undefined, 'Promise should be undefined');
  });

  it('should return promise when provided', async () => {
    const testPromise = Promise.resolve('test-value');
    const completion = createCompletion({ state: 'PENDING', promise: testPromise });
    strictEqual(completion.getPromise(), testPromise, 'Promise should match');
  });

  it('should return rejected promise', async () => {
    const testError = new Error('test-error');
    const testPromise = Promise.reject(testError).catch(() => {
      // Handle rejection to avoid unhandled rejection
      return undefined;
    });
    const completion = createCompletion({ state: 'FAILED', promise: testPromise });
    strictEqual(completion.getPromise(), testPromise, 'Promise should match');
  });

  it('should return promise with number value', async () => {
    const testPromise = Promise.resolve(42);
    const completion = createCompletion({ state: 'SUCCEEDED', promise: testPromise });
    strictEqual(completion.getPromise(), testPromise, 'Promise should match');
  });
});

describe('Completion Generic Type Tests', () => {
  it('should create completion for string type', () => {
    const completion = createCompletion<string>({ state: 'PENDING', value: 'test' });
    ok(isPresent(completion), 'Completion<string> should be created');
  });

  it('should create completion for number type', () => {
    const completion = createCompletion<number>({ state: 'PENDING', value: 123 });
    ok(isPresent(completion), 'Completion<number> should be created');
  });

  it('should create completion for boolean type', () => {
    const completion = createCompletion<boolean>({ state: 'PENDING', value: true });
    ok(isPresent(completion), 'Completion<boolean> should be created');
  });

  it('should create completion for object type', () => {
    const completion = createCompletion({ state: 'PENDING', value: { key: 'value' } });
    ok(isPresent(completion), 'Completion<object> should be created');
  });

  it('should create completion for array type', () => {
    const completion = createCompletion({ state: 'PENDING', value: [1, 2, 3] });
    ok(isPresent(completion), 'Completion<array> should be created');
  });
});

describe('Completion Config Combination Tests', () => {
  it('should combine all config options', () => {
    const value = 'test-value';
    const error = new Error('test-error');
    const promise = Promise.resolve('promise-value');
    
    const completion = createCompletion({
      state: 'SUCCEEDED',
      value,
      thrown: error,
      promise
    });

    strictEqual(completion.getState(), 'SUCCEEDED', 'State should be SUCCEEDED');
    strictEqual(completion.getValue(), value, 'Value should match');
    strictEqual(completion.getThrown(), error, 'Thrown should match');
    strictEqual(completion.getPromise(), promise, 'Promise should match');
  });

  it('should handle all terminal states with values', () => {
    const states: Array<'SUCCEEDED' | 'FAILED' | 'CANCELLED'> = ['SUCCEEDED', 'FAILED', 'CANCELLED'];
    
    states.forEach(state => {
      const completion = createCompletion({ state, value: 'test-value' });
      strictEqual(completion.isCompleted(), true, `${state} should be completed`);
      strictEqual(completion.getValue(), 'test-value', `${state} should have value`);
    });
  });

  it('should handle multiple instances independently', () => {
    const completion1 = createCompletion({ state: 'PENDING', value: 'value1' });
    const completion2 = createCompletion({ state: 'SUCCEEDED', value: 'value2' });
    const completion3 = createCompletion({ state: 'FAILED', value: 'value3' });

    strictEqual(completion1.getValue(), 'value1', 'Completion1 value should be value1');
    strictEqual(completion2.getValue(), 'value2', 'Completion2 value should be value2');
    strictEqual(completion3.getValue(), 'value3', 'Completion3 value should be value3');

    strictEqual(completion1.isCompleted(), false, 'Completion1 should be incomplete');
    strictEqual(completion2.isCompleted(), true, 'Completion2 should be completed');
    strictEqual(completion3.isCompleted(), true, 'Completion3 should be completed');
  });
});

describe('Completion Edge Cases Tests', () => {
  it('should handle empty string as value', () => {
    const completion = createCompletion<string>({ state: 'SUCCEEDED', value: '' });
    strictEqual(completion.getValue(), '', 'Value should be empty string');
  });

  it('should handle zero as value', () => {
    const completion = createCompletion<number>({ state: 'SUCCEEDED', value: 0 });
    strictEqual(completion.getValue(), 0, 'Value should be zero');
  });

  it('should handle false as value', () => {
    const completion = createCompletion<boolean>({ state: 'SUCCEEDED', value: false });
    strictEqual(completion.getValue(), false, 'Value should be false');
  });

  it('should handle empty array as value', () => {
    const completion = createCompletion<number[]>({ state: 'SUCCEEDED', value: [] });
    const value = completion.getValue();
    ok(Array.isArray(value), 'Value should be array');
    strictEqual(value?.length, 0, 'Array should be empty');
  });

  it('should handle empty object as value', () => {
    const completion = createCompletion<Record<string, never>>({ 
      state: 'SUCCEEDED', 
      value: {} 
    });
    const value = completion.getValue();
    ok(typeof value === 'object', 'Value should be object');
    strictEqual(Object.keys(value || {}).length, 0, 'Object should be empty');
  });
});

describe('Completion Integration Tests', () => {
  it('should integrate all getters in one completion', () => {
    const value = { id: 1, name: 'test' };
    const error = new Error('backup-error');
    const promise = Promise.resolve(value);

    const completion = createCompletion({
      state: 'SUCCEEDED',
      value,
      thrown: error,
      promise
    });

    // Test all getters
    ok(isPresent(completion.getState()), 'getState should return value');
    ok(isPresent(completion.getValue()), 'getValue should return value');
    ok(isPresent(completion.getThrown()), 'getThrown should return error');
    ok(isPresent(completion.getPromise()), 'getPromise should return promise');
    ok(completion.isCompleted(), 'isCompleted should return true');

    // Verify values
    strictEqual(completion.getState(), 'SUCCEEDED', 'State correct');
    strictEqual(completion.getValue(), value, 'Value correct');
    strictEqual(completion.getThrown(), error, 'Error correct');
    strictEqual(completion.getPromise(), promise, 'Promise correct');
  });

  it('should handle completion state transitions conceptually', () => {
    // Simulate a progression
    const pendingCompletion = createCompletion({ state: 'PENDING' });
    const successCompletion = createCompletion({ 
      state: 'SUCCEEDED', 
      value: 'success-result',
      promise: Promise.resolve('success-result')
    });

    strictEqual(pendingCompletion.isCompleted(), false, 'Pending should be incomplete');
    strictEqual(successCompletion.isCompleted(), true, 'Success should be completed');
    strictEqual(successCompletion.getValue(), 'success-result', 'Success value correct');
  });

  it('should handle failure completion pattern', () => {
    const error = new Error('operation-failed');
    const rejectedPromise = Promise.reject(error).catch(() => {
      // Handle rejection to avoid unhandled rejection
      return undefined;
    });
    
    const failureCompletion = createCompletion({ 
      state: 'FAILED',
      thrown: error,
      promise: rejectedPromise
    });

    strictEqual(failureCompletion.isCompleted(), true, 'Failure should be completed');
    strictEqual(failureCompletion.getThrown(), error, 'Error should match');
    ok(failureCompletion.getPromise() instanceof Promise, 'Promise should be present');
  });

  it('should handle cancellation completion pattern', () => {
    const cancellationCompletion = createCompletion({ 
      state: 'CANCELLED'
    });

    strictEqual(cancellationCompletion.isCompleted(), true, 'Cancelled should be completed');
    strictEqual(cancellationCompletion.getValue(), undefined, 'No value for cancellation');
    strictEqual(cancellationCompletion.getThrown(), undefined, 'No error for cancellation');
  });
});