import { ok } from "node:assert";

import { presentCheck } from "@jonloucks/concurrency-ts/auxiliary/Checks";

describe('Index exports', () => {
  it('should export all expected members', () => {
    // Just checking a few key exports to ensure they are accessible  
    ok(presentCheck, 'presentCheck should be exported');
    // Add more exports to check as needed
  });
});