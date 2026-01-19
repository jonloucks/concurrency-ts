import { throws } from "node:assert";

import { ConcurrencyException } from "@jonloucks/concurrency-ts/api/ConcurrencyException";

describe('ConcurrencyException Tests', () => {
  it('without message throws IllegalArgumentException', () => {
    throws(() => {
      new ConcurrencyException(null as unknown as string);
    }, {
      name: 'IllegalArgumentException',
      message: 'Message must be present.'
    });
  });

  it('with message, has correct name and message', () => {
    throws(() => {
      throw new ConcurrencyException("Problem.");
    }, {
      name: 'ConcurrencyException',
      message: "Problem."
    });
  });


  it('rethrow with Error caught with message, has correct name and message', () => {
    throws(() => {
      ConcurrencyException.rethrow(new Error("Inner problem."), "Outer Problem.");
    }, {
      name: 'ConcurrencyException',
      message: "Outer Problem."
    });
  });

  it('rethrow with Error caught without message, has correct name and message', () => {
    throws(() => {
      ConcurrencyException.rethrow(new Error("Inner problem."));
    }, {
      name: 'ConcurrencyException',
      message: "Inner problem."
    });
  });

  it('rethrow with null caught without message, has correct name and message', () => {
    throws(() => {
      ConcurrencyException.rethrow(null);
    }, {
      name: 'ConcurrencyException',
      message: "Unknown type of caught value."
    });
  });

  it('rethrow with null caught with message, has correct name and message', () => {
    throws(() => {
      ConcurrencyException.rethrow(null, "Outer Problem.");
    }, {
      name: 'ConcurrencyException',
      message: "Outer Problem."
    });
  });


  it('rethrow with ConcurrencyException caught with message, has correct name and message', () => {
    throws(() => {
      ConcurrencyException.rethrow(new ConcurrencyException("Inner Problem."), "Outer Problem.");
    }, {
      name: 'ConcurrencyException',
      message: "Inner Problem."
    });
  });
});
