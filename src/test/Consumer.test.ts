import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { Consumer, Type, guard, Method, fromType, check } from "@jonloucks/concurrency-ts/auxiliary/Consumer";
import { assertGuard } from "./helper.test";

describe('Consumer Tests', () => {
  it('isConsumer should return true for Consumer', () => {
    const consumer: Consumer<string> = mock<Consumer<string>>();
    ok(guard(consumer), 'Consumer should return true');
  });
});

describe('fromType Tests', () => {
  it('fromType should convert Method to Consumer', () => {
    const method: Method<number> = (_: number) => { /* do nothing */ };
    const consumer: Consumer<number> = fromType<number>(method);
    ok(guard(consumer), 'fromType should return a valid Consumer');
  });

  it('fromType should return Consumer as is', () => {
    const originalConsumer: Consumer<number> = mock<Consumer<number>>();
    const consumer: Consumer<number> = fromType<number>(originalConsumer);
    ok(consumer === originalConsumer, 'fromType should return the original Consumer');
  });
});

describe('check Tests', () => {
  it('check should return the Consumer if present', () => {
    const consumer: Consumer<string> = mock<Consumer<string>>();
    const checkedConsumer: Type<string> = check<string>(consumer);
    ok(checkedConsumer === consumer, 'check should return the original Consumer');
  });

  it('check should throw error if Consumer is null or undefined', () => {
    let errorCaught = false;
    try {
      check<string>(null as unknown as Type<string>);
    } catch (_) {
      errorCaught = true;
    }
    ok(errorCaught, 'check should throw an error for null Consumer');
  });
});

assertGuard(guard, 'consume');