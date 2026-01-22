import { mock } from "jest-mock-extended";
import { ok } from "node:assert";

import { Waitable, guard } from "@jonloucks/concurrency-ts/api/Waitable";
import { assertGuard } from "./helper.test";

describe('Waitable tests', () => {
  it('isWaitable should return true for Waitable', () => {
    const waitable: Waitable<string> = mock<Waitable<string>>();
    ok(guard(waitable), 'Waitable should return true');
  });
});

assertGuard(guard,
  'shutdown',
  'get',
  'getIf',
  'getWhen',
  'accept',
  'acceptIf',
  'acceptWhen',
  'notifyIf'
);
