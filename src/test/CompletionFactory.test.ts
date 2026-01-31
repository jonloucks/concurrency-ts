import { ok, strictEqual } from "node:assert";

import { CompletionConfig } from "@jonloucks/concurrency-ts/api/Completion";
import { CompletionFactory, CONTRACT, guard } from "@jonloucks/concurrency-ts/api/CompletionFactory";
import { isPresent } from "@jonloucks/contracts-ts/api/Types";
import { Config as ConcurrencyConfig } from "@jonloucks/concurrency-ts/api/Concurrency";
import { assertContract, assertGuard, mockDuck } from "./helper.test";

import { create as createCompletionFactory } from "../impl/CompletionFactory.impl";

const FUNCTION_NAMES : (string|symbol)[] = [
  'createCompletion'
];

describe('CompletionFactory Tests', () => {
  it('isCompletionFactory should return true for CompletionFactory', () => {
    const factory: CompletionFactory = mockDuck<CompletionFactory>(...FUNCTION_NAMES);
    ok(guard(factory), 'CompletionFactory should return true');
  });
});

assertGuard(guard, ...FUNCTION_NAMES);

assertContract(CONTRACT, 'CompletionFactory');

describe('CompletionFactory Implementation Tests', () => {
  let config: ConcurrencyConfig;
  let factory: CompletionFactory;

  beforeEach(() => {
    config = {};
    factory = createCompletionFactory(config);
  });

  it('should create factory with valid config', () => {
    ok(isPresent(factory), 'Factory should be created');
  });

  it('should have createCompletion method', () => {
    ok(isPresent(factory.createCompletion), 'Factory should have createCompletion method');
  });

  it('should create completion with PENDING state', () => {
    const completionConfig: CompletionConfig<string> = {
      state: 'PENDING'
    };
    const completion = factory.createCompletion(completionConfig);
    ok(isPresent(completion), 'Completion should be created');
    strictEqual(completion.getState(), 'PENDING', 'Completion state should be PENDING');
  });

  it('should create completion with value', () => {
    const testValue = 'test-value';
    const completionConfig: CompletionConfig<string> = {
      state: 'SUCCEEDED',
      value: testValue
    };
    const completion = factory.createCompletion(completionConfig);
    strictEqual(completion.getValue(), testValue, 'Completion value should match');
  });

  it('should create completion with thrown error', () => {
    const testError = new Error('Test error');
    const completionConfig: CompletionConfig<string> = {
      state: 'FAILED',
      thrown: testError
    };
    const completion = factory.createCompletion(completionConfig);
    strictEqual(completion.getThrown(), testError, 'Completion error should match');
  });

  it('should create completion with promise', () => {
    const testPromise = Promise.resolve('resolved-value');
    const completionConfig: CompletionConfig<string> = {
      state: 'PENDING',
      promise: testPromise
    };
    const completion = factory.createCompletion(completionConfig);
    ok(isPresent(completion.getPromise()), 'Completion promise should be present');
  });
});

describe('CompletionFactory Multiple Completions Tests', () => {
  let config: ConcurrencyConfig;
  let factory: CompletionFactory;

  beforeEach(() => {
    config = {};
    factory = createCompletionFactory(config);
  });

  it('should create multiple independent completions', () => {
    const completion1 = factory.createCompletion({ state: 'PENDING' });
    const completion2 = factory.createCompletion({ state: 'SUCCEEDED', value: 'value1' });
    const completion3 = factory.createCompletion({ state: 'FAILED', thrown: new Error('error1') });
    
    ok(isPresent(completion1), 'First completion should be created');
    ok(isPresent(completion2), 'Second completion should be created');
    ok(isPresent(completion3), 'Third completion should be created');
    
    strictEqual(completion1.getState(), 'PENDING', 'First completion state should be PENDING');
    strictEqual(completion2.getState(), 'SUCCEEDED', 'Second completion state should be SUCCEEDED');
    strictEqual(completion3.getState(), 'FAILED', 'Third completion state should be FAILED');
  });

  it('should create completions with different types', () => {
    const stringCompletion = factory.createCompletion<string>({ state: 'SUCCEEDED', value: 'string-value' });
    const numberCompletion = factory.createCompletion<number>({ state: 'SUCCEEDED', value: 42 });
    const booleanCompletion = factory.createCompletion<boolean>({ state: 'SUCCEEDED', value: true });
    
    strictEqual(stringCompletion.getValue(), 'string-value', 'String completion value should match');
    strictEqual(numberCompletion.getValue(), 42, 'Number completion value should match');
    strictEqual(booleanCompletion.getValue(), true, 'Boolean completion value should match');
  });
});

describe('CompletionFactory State Transitions Tests', () => {
  let config: ConcurrencyConfig;
  let factory: CompletionFactory;

  beforeEach(() => {
    config = {};
    factory = createCompletionFactory(config);
  });

  it('should create completion in PENDING state', () => {
    const completion = factory.createCompletion<string>({ state: 'PENDING' });
    strictEqual(completion.getState(), 'PENDING', 'Should be in PENDING state');
  });

  it('should create completion in SUCCEEDED state', () => {
    const completion = factory.createCompletion<string>({ state: 'SUCCEEDED', value: 'success' });
    strictEqual(completion.getState(), 'SUCCEEDED', 'Should be in SUCCEEDED state');
    strictEqual(completion.getValue(), 'success', 'Should have success value');
  });

  it('should create completion in FAILED state', () => {
    const error = new Error('failure');
    const completion = factory.createCompletion<string>({ state: 'FAILED', thrown: error });
    strictEqual(completion.getState(), 'FAILED', 'Should be in FAILED state');
    strictEqual(completion.getThrown(), error, 'Should have error');
  });

  it('should create completion in CANCELLED state', () => {
    const completion = factory.createCompletion<string>({ state: 'CANCELLED' });
    strictEqual(completion.getState(), 'CANCELLED', 'Should be in CANCELLED state');
  });
});

describe('CompletionFactory Completion Interface Tests', () => {
  let config: ConcurrencyConfig;
  let factory: CompletionFactory;

  beforeEach(() => {
    config = {};
    factory = createCompletionFactory(config);
  });

  it('created completion should have getState method', () => {
    const completion = factory.createCompletion({ state: 'PENDING' });
    ok(isPresent(completion.getState), 'Completion should have getState method');
    ok(typeof completion.getState === 'function', 'getState should be a function');
  });

  it('created completion should have getValue method', () => {
    const completion = factory.createCompletion({ state: 'PENDING' });
    ok(isPresent(completion.getValue), 'Completion should have getValue method');
    ok(typeof completion.getValue === 'function', 'getValue should be a function');
  });

  it('created completion should have getThrown method', () => {
    const completion = factory.createCompletion({ state: 'PENDING' });
    ok(isPresent(completion.getThrown), 'Completion should have getThrown method');
    ok(typeof completion.getThrown === 'function', 'getThrown should be a function');
  });

  it('created completion should have getPromise method', () => {
    const completion = factory.createCompletion({ state: 'PENDING' });
    ok(isPresent(completion.getPromise), 'Completion should have getPromise method');
    ok(typeof completion.getPromise === 'function', 'getPromise should be a function');
  });

  it('created completion should have isCompleted method', () => {
    const completion = factory.createCompletion({ state: 'PENDING' });
    ok(isPresent(completion.isCompleted), 'Completion should have isCompleted method');
    ok(typeof completion.isCompleted === 'function', 'isCompleted should be a function');
  });
});

describe('CompletionFactory Config Variants Tests', () => {
  let factory: CompletionFactory;

  beforeEach(() => {
    factory = createCompletionFactory({});
  });

  it('should create completion with state only', () => {
    const completion = factory.createCompletion({ state: 'PENDING' });
    ok(isPresent(completion), 'Completion should be created with state only');
    strictEqual(completion.getState(), 'PENDING', 'State should be set');
  });

  it('should create completion with state and value', () => {
    const completion = factory.createCompletion({ state: 'SUCCEEDED', value: 'test-value' });
    ok(isPresent(completion), 'Completion should be created');
    strictEqual(completion.getValue(), 'test-value', 'Value should be set');
  });

  it('should create completion with state and thrown', () => {
    const error = new Error('test-error');
    const completion = factory.createCompletion({ state: 'FAILED', thrown: error });
    ok(isPresent(completion), 'Completion should be created');
    strictEqual(completion.getThrown(), error, 'Error should be set');
  });

  it('should create completion with state and promise', () => {
    const promise = Promise.resolve('resolved');
    const completion = factory.createCompletion({ state: 'PENDING', promise });
    ok(isPresent(completion), 'Completion should be created');
    ok(isPresent(completion.getPromise()), 'Promise should be set');
  });

  it('should create completion with all config properties', () => {
    const value = 'completion-value';
    const error = new Error('completion-error');
    const promise = Promise.resolve(value);
    const completion = factory.createCompletion({ 
      state: 'PENDING',
      value,
      thrown: error,
      promise
    });
    ok(isPresent(completion), 'Completion should be created');
    strictEqual(completion.getValue(), value, 'Value should be set');
    strictEqual(completion.getThrown(), error, 'Error should be set');
    ok(isPresent(completion.getPromise()), 'Promise should be set');
  });
});
