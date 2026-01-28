import { ok, throws } from "node:assert";

import { ConsumerFunction, PredicateFunction, SupplierFunction } from "@jonloucks/concurrency-ts/api/Types";
import { failureBlockCheck, finallyBlockCheck, onFailureCheck, onFinallyCheck, onSuccessCheck, predicateCheck, successBlockCheck } from "@jonloucks/concurrency-ts/auxiliary/Checks";

describe('Index exports', () => {
  it('should export all expected members', () => {
    // Just checking a few key exports to ensure they are accessible  
    ok(onSuccessCheck, 'onSuccessCheck should be exported');
    ok(onFailureCheck, 'onFailureCheck should be exported');
    ok(onFinallyCheck, 'onFinallyCheck should be exported');
    ok(successBlockCheck, 'successBlockCheck should be exported');
    ok(failureBlockCheck, 'failureBlockCheck should be exported');
    ok(finallyBlockCheck, 'finallyBlockCheck should be exported');
    ok(predicateCheck, 'predicateCheck should be exported');
  });
});

describe('onSuccessCheck function', () => {
  it('should return the provided consumer when it is present', () => {
    const consumer: ConsumerFunction<number> = (_value: number) => { };
    ok(consumer == onSuccessCheck(consumer), 'onSuccessCheck should return the original consumer when present');
  });
});

describe('onFailureCheck function', () => {
  it('should return the provided consumer when it is present', () => {
    const consumer : ConsumerFunction<Error>= (_error: Error) => { /* handle error */ };
    const result = onFailureCheck(consumer);
    ok(result === consumer, 'onFailureCheck should return the original consumer when present');
  });
});

describe('onFinallyCheck function', () => {
  it('should return the provided consumer when it is present', () => {
    const consumer: ConsumerFunction<string> = (_value: string) => { };
    const result = onFinallyCheck(consumer);
    ok(result === consumer, 'onFinallyCheck should return the original consumer when present');
  });

  it('should throw IllegalArgumentException when consumer is null', () => {
    throws(() => {
      onFinallyCheck(null);
    }, {
      name: 'IllegalArgumentException',
      message: 'OnFinally consumer must be Present.'
    });
  });

  it('should throw IllegalArgumentException when consumer is undefined', () => {
    throws(() => {
      onFinallyCheck(undefined);
    }, {
      name: 'IllegalArgumentException',
      message: 'OnFinally consumer must be Present.'
    });
  });
});

describe('successBlockCheck function', () => {
  it('should return the provided supplier when it is present', () => {
    const supplier: SupplierFunction<string> = () => "success";
    const result = successBlockCheck(supplier);
    ok(result === supplier, 'successBlockCheck should return the original supplier when present');
  });

  it('should throw IllegalArgumentException when supplier is null', () => {
    throws(() => {
      successBlockCheck(null);
    }, {
      name: 'IllegalArgumentException',
      message: 'Success block must be Present.'
    });
  });

  it('should throw IllegalArgumentException when supplier is undefined', () => {
    throws(() => {
      successBlockCheck(undefined);
    }, {
      name: 'IllegalArgumentException',
      message: 'Success block must be Present.'
    });
  });
});

describe('failureBlockCheck function', () => {
  it('should return the provided supplier when it is present', () => {
    const supplier: SupplierFunction<string> = () => "failure";
    const result = failureBlockCheck(supplier);
    ok(result === supplier, 'failureBlockCheck should return the original supplier when present');
  });

  it('should throw IllegalArgumentException when supplier is null', () => {
    throws(() => {
      failureBlockCheck(null);
    }, {
      name: 'IllegalArgumentException',
      message: 'Failure block must be Present.'
    });
  });

  it('should throw IllegalArgumentException when supplier is undefined', () => {
    throws(() => {
      failureBlockCheck(undefined);
    }, {
      name: 'IllegalArgumentException',
      message: 'Failure block must be Present.'
    });
  });
});

describe('finallyBlockCheck function', () => {
  it('should return the provided supplier when it is present', () => {
    const supplier: SupplierFunction<number> = () => 42;
    const result = finallyBlockCheck(supplier);
    ok(result === supplier, 'finallyBlockCheck should return the original supplier when present');
  });

  it('should throw IllegalArgumentException when supplier is null', () => {
    throws(() => {
      finallyBlockCheck(null);
    }, {
      name: 'IllegalArgumentException',
      message: 'Finally block must be Present.'
    });
  });

  it('should throw IllegalArgumentException when supplier is undefined', () => {
    throws(() => {
      finallyBlockCheck(undefined);
    }, {
      name: 'IllegalArgumentException',
      message: 'Finally block must be Present.'
    });
  });
});

describe('predicateCheck function', () => {
  it('should return the provided predicate when it is present', () => {
    const predicate: PredicateFunction<number> = (value: number) => value > 0;
    const result = predicateCheck(predicate);
    ok(result === predicate, 'predicateCheck should return the original predicate when present');
  });

  it('should throw IllegalArgumentException when predicate is null', () => {
    throws(() => {
      predicateCheck(null);
    }, {
      name: 'IllegalArgumentException',
      message: 'Predicate must be Present.'
    });
  });

  it('should throw IllegalArgumentException when predicate is undefined', () => {
    throws(() => {
      predicateCheck(undefined);
    }, {
      name: 'IllegalArgumentException',
      message: 'Predicate must be Present.'
    });
  });
});

describe('onSuccessCheck function edge cases', () => {
  it('should throw IllegalArgumentException when consumer is null', () => {
    throws(() => {
      onSuccessCheck(null);
    }, {
      name: 'IllegalArgumentException',
      message: 'OnSuccess consumer must be Present.'
    });
  });

  it('should throw IllegalArgumentException when consumer is undefined', () => {
    throws(() => {
      onSuccessCheck(undefined);
    }, {
      name: 'IllegalArgumentException',
      message: 'OnSuccess consumer must be Present.'
    });
  });
});

describe('onFailureCheck function edge cases', () => {
  it('should throw IllegalArgumentException when consumer is null', () => {
    throws(() => {
      onFailureCheck(null);
    }, {
      name: 'IllegalArgumentException',
      message: 'OnFailure consumer must be Present.'
    });
  });

  it('should throw IllegalArgumentException when consumer is undefined', () => {
    throws(() => {
      onFailureCheck(undefined);
    }, {
      name: 'IllegalArgumentException',
      message: 'OnFailure consumer must be Present.'
    });
  });
});