import { ok } from "node:assert";
import { mock } from "jest-mock-extended";

import { Waitable, isWaitable } from "@jonloucks/concurrency-ts/api/Waitable";
import { assertDuck } from "./helper.test";

describe('Waitable tests', () => {
  it('isWaitable should return true for Waitable', () => {
    const waitable: Waitable<string> = mock<Waitable<string>>();
    ok(isWaitable(waitable), 'Waitable should return true');
  });
});

assertDuck(isWaitable,
  'shutdown',
  'get',
  'getIf',
  'getWhen',
  'accept',
  'acceptIf',
  'acceptWhen',
  'notifyIf'
);
