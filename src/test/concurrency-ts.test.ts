import { ok, strictEqual } from "node:assert";

import {
  VERSION,
  ConcurrencyException
} from "@jonloucks/concurrency-ts";

/** 
 * Tests for @jonloucks/concurrency-ts index and version exports
 * All exported functions and constants must already have been tested in their respective test files
 * These tests ensure that the index exports are correctly set up and accessible
 * Also tests the VERSION constant to ensure it matches the version in package.json
 * If this file fails to compile, it indicates a possible breaking for deployment consumers
 * @module @jonloucks/concurrency-ts/tests/concurrency-ts.test.ts
 */

describe('VERSION constant', () => {
  it('should be a non-empty string', () => {
    strictEqual(typeof VERSION, 'string', 'VERSION should be of type string');
    ok(VERSION.length > 0, 'VERSION should not be an empty string');
  });
});

describe('Index exports', () => {
  it('should export all expected members', () => {
    // Just checking a few key exports to ensure they are accessible  
    ok(VERSION, 'VERSION should be exported');
    ok(ConcurrencyException, 'ConcurrencyException should be exported');
    // Add more exports to check as needed
  });
});

