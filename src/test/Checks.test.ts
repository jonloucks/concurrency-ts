import { ok, throws } from "node:assert";

import { Duration } from "@jonloucks/concurrency-ts/api/Types";
import {
  completionCheck,
  configCheck,
  eventCheck,
  finallyBlockCheck,
  failureBlockCheck,
  initialValueCheck,
  predicateCheck,
  successBlockCheck,
  illegalCheck,
  listenerCheck,
  presentCheck,
  ruleCheck,
  rulesCheck,
  stateCheck,
  timeoutCheck
} from "@jonloucks/concurrency-ts/auxiliary/Checks";

describe('Index exports', () => {
  it('should export all check functions', () => {
    ok(stateCheck, 'stateCheck should be exported');
    ok(eventCheck, 'eventCheck should be exported');
    ok(ruleCheck, 'ruleCheck should be exported');
    ok(rulesCheck, 'rulesCheck should be exported');
    ok(listenerCheck, 'listenerCheck should be exported');
    ok(timeoutCheck, 'timeoutCheck should be exported');
    ok(completionCheck, 'completionCheck should be exported');
    ok(presentCheck, 'presentCheck should be exported');
    ok(illegalCheck, 'illegalCheck should be exported');
    ok(configCheck, 'configCheck should be exported');
    ok(finallyBlockCheck, 'finallyBlockCheck should be exported');
    ok(failureBlockCheck, 'failureBlockCheck should be exported');
    ok(initialValueCheck, 'initialValueCheck should be exported');
    ok(predicateCheck, 'predicateCheck should be exported');
    ok(successBlockCheck, 'successBlockCheck should be exported');
  });
});

describe('stateCheck function', () => {
  it('should return the provided state when it is present', () => {
    const state = { id: 123 };
    const result = stateCheck(state);
    ok(result === state, 'stateCheck should return the original state when present');
  });

  it('should throw IllegalArgumentException when state is null', () => {
    throws(() => {
      stateCheck(null);
    }, {
      name: 'IllegalArgumentException',
      message: 'State must be present.'
    });
  });

  it('should throw IllegalArgumentException when state is undefined', () => {
    throws(() => {
      stateCheck(undefined);
    }, {
      name: 'IllegalArgumentException',
      message: 'State must be present.'
    });
  });
});

describe('eventCheck function', () => {
  it('should return the provided event when it is present', () => {
    const event = 'button_clicked';
    const result = eventCheck(event);
    ok(result === event, 'eventCheck should return the original event when present');
  });

  it('should throw IllegalArgumentException when event is null', () => {
    throws(() => {
      eventCheck(null as unknown as string);
    }, {
      name: 'IllegalArgumentException',
      message: 'Event must be present.'
    });
  });

  it('should throw IllegalArgumentException when event is undefined', () => {
    throws(() => {
      eventCheck(undefined as unknown as string);
    }, {
      name: 'IllegalArgumentException',
      message: 'Event must be present.'
    });
  });
});

describe('ruleCheck function', () => {
  it('should return the provided rule when it is present', () => {
    const rule = { condition: true, action: () => {} };
    const result = ruleCheck(rule);
    ok(result === rule, 'ruleCheck should return the original rule when present');
  });

  it('should throw IllegalArgumentException when rule is null', () => {
    throws(() => {
      ruleCheck(null);
    }, {
      name: 'IllegalArgumentException',
      message: 'Rule must be present.'
    });
  });

  it('should throw IllegalArgumentException when rule is undefined', () => {
    throws(() => {
      ruleCheck(undefined);
    }, {
      name: 'IllegalArgumentException',
      message: 'Rule must be present.'
    });
  });
});

describe('rulesCheck function', () => {
  it('should return the provided rules array when it is present', () => {
    const rules = [{ rule: 1 }, { rule: 2 }];
    const result = rulesCheck(rules);
    ok(result === rules, 'rulesCheck should return the original rules array when present');
  });

  it('should return empty array when it is present', () => {
    const rules: unknown[] = [];
    const result = rulesCheck(rules);
    ok(result === rules, 'rulesCheck should return empty array when present');
  });

  it('should throw IllegalArgumentException when rules is null', () => {
    throws(() => {
      rulesCheck(null as unknown as unknown[]);
    }, {
      name: 'IllegalArgumentException',
      message: 'Rules must be present.'
    });
  });

  it('should throw IllegalArgumentException when rules is undefined', () => {
    throws(() => {
      rulesCheck(undefined as unknown as unknown[]);
    }, {
      name: 'IllegalArgumentException',
      message: 'Rules must be present.'
    });
  });
});

describe('listenerCheck function', () => {
  it('should return the provided listener when it is present', () => {
    const listener = () => {};
    const result = listenerCheck(listener);
    ok(result === listener, 'listenerCheck should return the original listener when present');
  });

  it('should throw IllegalArgumentException when listener is null', () => {
    throws(() => {
      listenerCheck(null);
    }, {
      name: 'IllegalArgumentException',
      message: 'Listener must be present.'
    });
  });

  it('should throw IllegalArgumentException when listener is undefined', () => {
    throws(() => {
      listenerCheck(undefined);
    }, {
      name: 'IllegalArgumentException',
      message: 'Listener must be present.'
    });
  });
});

describe('timeoutCheck function', () => {
  it('should return the provided timeout when it is valid', () => {
    const timeout: Duration = { milliSeconds: 5000 };
    const result = timeoutCheck(timeout);
    ok(result === timeout, 'timeoutCheck should return the original timeout when valid');
  });

  it('should accept zero timeout', () => {
    const timeout: Duration = { milliSeconds: 0 };
    const result = timeoutCheck(timeout);
    ok(result === timeout, 'timeoutCheck should accept zero timeout');
  });

  it('should throw IllegalArgumentException when timeout is null', () => {
    throws(() => {
      timeoutCheck(null as unknown as Duration);
    }, {
      name: 'IllegalArgumentException',
      message: 'Timeout must be present.'
    });
  });

  it('should throw IllegalArgumentException when timeout is undefined', () => {
    throws(() => {
      timeoutCheck(undefined as unknown as Duration);
    }, {
      name: 'IllegalArgumentException',
      message: 'Timeout must be present.'
    });
  });

  it('should throw IllegalArgumentException when timeout is negative', () => {
    throws(() => {
      timeoutCheck({ milliSeconds: -100 });
    }, {
      name: 'IllegalArgumentException',
      message: 'Timeout must not be negative.'
    });
  });

  it('should throw IllegalArgumentException when timeout exceeds MAX_TIMEOUT', () => {
    throws(() => {
      timeoutCheck({ milliSeconds: Number.MAX_SAFE_INTEGER + 1 });
    }, {
      name: 'IllegalArgumentException',
      message: 'Timeout must less than or equal to maximum time.'
    });
  });

  it('should accept MAX_TIMEOUT', () => {
    const timeout: Duration = { milliSeconds: Number.MAX_SAFE_INTEGER };
    const result = timeoutCheck(timeout);
    ok(result === timeout, 'timeoutCheck should accept MAX_TIMEOUT');
  });
});

describe('completionCheck function', () => {
  it('should return the provided completion when it is present', () => {
    const completion = { status: 'completed' };
    const result = completionCheck(completion);
    ok(result === completion, 'completionCheck should return the original completion when present');
  });

  it('should throw IllegalArgumentException when completion is null', () => {
    throws(() => {
      completionCheck(null);
    }, {
      name: 'IllegalArgumentException',
      message: 'Completion must be present.'
    });
  });

  it('should throw IllegalArgumentException when completion is undefined', () => {
    throws(() => {
      completionCheck(undefined);
    }, {
      name: 'IllegalArgumentException',
      message: 'Completion must be present.'
    });
  });
});

describe('finallyBlockCheck function', () => {
  it('should return the provided finally block when it is present', () => {
    const block = () => {};
    const result = finallyBlockCheck(block);
    ok(result === block, 'finallyBlockCheck should return the original block when present');
  });

  it('should throw IllegalArgumentException when finally block is null', () => {
    throws(() => {
      finallyBlockCheck(null);
    }, {
      name: 'IllegalArgumentException',
      message: 'OnFinally consumer must be present.'
    });
  });

  it('should throw IllegalArgumentException when finally block is undefined', () => {
    throws(() => {
      finallyBlockCheck(undefined);
    }, {
      name: 'IllegalArgumentException',
      message: 'OnFinally consumer must be present.'
    });
  });
});

describe('predicateCheck function', () => {
  it('should return the provided predicate when it is present', () => {
    const predicate = () => true;
    const result = predicateCheck(predicate);
    ok(result === predicate, 'predicateCheck should return the original predicate when present');
  });
  
  it('should throw IllegalArgumentException when predicate is null', () => {
    throws(() => {
      predicateCheck(null);
    }, {
      name: 'IllegalArgumentException',
      message: 'Predicate must be present.'
    });
  });

  it('should throw IllegalArgumentException when predicate is undefined', () => {
    throws(() => {
      predicateCheck(undefined);
    }, {
      name: 'IllegalArgumentException',
      message: 'Predicate must be present.'
    });
  }); 
});

describe('successBlockCheck function', () => {
  it('should return the provided success block when it is present', () => {
    const onSuccess = () => {};
    const result = successBlockCheck(onSuccess);
    ok(result === onSuccess, 'successBlockCheck should return the original onSuccess when present');
  });
  
  it('should throw IllegalArgumentException when success block is null', () => {
    throws(() => {
      successBlockCheck(null);
    }, {
      name: 'IllegalArgumentException',
      message: 'OnSuccess consumer must be present.'
    });
  });

  it('should throw IllegalArgumentException when success block is undefined', () => {
    throws(() => {
      successBlockCheck(undefined);
    }, {
      name: 'IllegalArgumentException',
      message: 'OnSuccess consumer must be present.'
    });
  }); 
});

describe('failureBlockCheck function', () => {
  it('should return the provided failure block when it is present', () => {
    const onFailure = () => {};
    const result = failureBlockCheck(onFailure);
    ok(result === onFailure, 'failureBlockCheck should return the original onFailure when present');
  });
});

describe('presentCheck re-export', () => {
  it('should work as re-exported from contracts-ts', () => {
    const value = 'test';
    const result = presentCheck(value, 'Test message');
    ok(result === value, 'presentCheck should return the value when present');
  });

  it('should throw when value is null', () => {
    throws(() => {
      presentCheck(null, 'Test message');
    }, {
      name: 'IllegalArgumentException',
      message: 'Test message'
    });
  });
});

describe('illegalCheck re-export', () => {
  it('should work as re-exported from contracts-ts', () => {
    const value = 'test';
    const result = illegalCheck(value, false, 'Test message');
    ok(result === value, 'illegalCheck should return the value when condition is false');
  });

  it('should throw when condition is true', () => {
    throws(() => {
      illegalCheck('test', true, 'Condition violated');
    }, {
      name: 'IllegalArgumentException',
      message: 'Condition violated'
    });
  });
});

describe('configCheck re-export', () => {
  it('should be exported from contracts-ts', () => {
    ok(configCheck, 'configCheck should be exported');
  });
});