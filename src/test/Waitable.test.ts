import { mock } from "jest-mock-extended";
import { ok, throws } from "node:assert";

import { Waitable, guard } from "@jonloucks/concurrency-ts/api/Waitable";
import { assertGuard } from "./helper.test";

//TODO: Replace with real import when available
import { create as createWaitable } from "../impl/WaitableImpl";
import { Consumer } from "../api/Concurrency";
import { AutoClose } from "@jonloucks/contracts-ts";

describe('Waitable tests', () => {
  it('isWaitable should return true for Waitable', () => {
    const waitable: Waitable<string> = mock<Waitable<string>>();
    ok(guard(waitable), 'Waitable should return true');
  });
});

describe('Waitable tests', () => {
  it('createWaitable with no config should create a Waitable instance', () => {
    const waitable: Waitable<number> = createWaitable<number>({});

    ok(waitable.supply() === undefined);
  });

  it('createWaitable should create a Waitable instance', () => {
    const waitable: Waitable<string> = createWaitable<string>({ initialValue: "initial" });

    ok(waitable.supply() === "initial");
  });

  it('consume should update the value', () => {
    const waitable: Waitable<number> = createWaitable<number>({ initialValue: 1 });

    waitable.consume(10);
    ok(waitable.supply() === 10, 'First consume should return initial value');

    waitable.consume(() => waitable.supply() + 5);

    const value2 = waitable.supply();
    ok(value2 === 15, 'Second consume should return updated value');
  });

  it('consumeIf should update the value when predicate is satisfied', () => {
    const waitable: Waitable<number> = createWaitable<number>({ initialValue: 20 });

    const result1 = waitable.consumeIf((val) => val > 10, () => 30);
    ok(result1 === 30, 'consumeIf should update value when predicate is satisfied');
    ok(waitable.supply() === 30, 'Value should be updated to 30');

    const result2 = waitable.consumeIf((val) => val < 10, () => 40);
    ok(result2 === undefined, 'consumeIf should not update value when predicate is not satisfied');
    ok(waitable.supply() === 30, 'Value should remain 30');
  });

  it('consumeWhen should update the value when predicate is satisfied', async () => {
    const waitable: Waitable<number> = createWaitable<number>({ initialValue: 50 });

    using _usingWaitable = waitable.open();

    const promise1 = waitable.consumeWhen((val) => val === 50, () => 60);
    const result1 = await promise1;
    ok(result1 === 60, 'consumeWhen should update value when predicate is satisfied');
    ok(waitable.supply() === 60, 'Value should be updated to 60');

    const promise2 = waitable.consumeWhen((val) => val === 100, () => 70);
    let isResolved = false;
    promise2.then((result2) => {
      isResolved = true;
      ok(result2 === 70, 'consumeWhen should update value when predicate is satisfied later');
      ok(waitable.supply() === 70, 'Value should be updated to 70');
    });

    // Simulate another consume that satisfies the predicate
    setTimeout(() => {
      waitable.consume(100);
    }, 100);

    // Wait a bit to allow the promise to resolve
    await new Promise((resolve) => setTimeout(resolve, 200));
    ok(isResolved, 'consumeWhen promise should be resolved after predicate is satisfied');
  });

  it('consumeWhen when not open should reject with exception', async () => {
    const waitable: Waitable<number> = createWaitable<number>({ initialValue: 0 });

    let threwException = false;

    const promise = waitable.consumeWhen((val) => val === 10, () => 20);
    await promise.catch(() => { threwException = true });

    ok(threwException, 'consumeWhen should reject with exception when Waitable is not open');
  });

  it('notifyWhile when not open should throw exception', async () => {
    const waitable: Waitable<number> = createWaitable<number>({ initialValue: 0 });

    throws(() => {
      waitable.notifyWhile((val) => val < 10, () => { });
    }, {
      name: 'IllegalStateException',
      message: "Waitable must be open."
    });
  });

  it('notifyWhile should notify observers while predicate is satisfied', async () => {
    const waitable: Waitable<number> = createWaitable<number>({ initialValue: 5 });
    using _usingWaitable = waitable.open();

    let notifications: number[] = [];

    const observer: Consumer<number> = {
      consume: (value: number) => {
        notifications.push(value);
      }
    };

    {
      using _notifyWhile = waitable.notifyWhile((val) => val < 15, observer);

      // Simulate value changes
      for (let i = 6; i <= 20; i += 3) {
        waitable.consume(i);
      }
      await new Promise((resolve, _) => setTimeout(resolve, 100));
    }

    ok(notifications.length > 0, 'Observer should have received notifications');
    ok(notifications[0] === 5, 'First notification should be initial value');
    ok(notifications[notifications.length - 1] < 15, 'Last notification should be less than 15');
  });

  it('supplyIf should return value when predicate is satisfied', () => {
    const waitable: Waitable<string> = createWaitable<string>({ initialValue: "hello" });

    const result1 = waitable.supplyIf((val) => val === "hello");
    ok(result1 === "hello", 'supplyIf should return value when predicate is satisfied');

    const result2 = waitable.supplyIf((val) => val === "world");
    ok(result2 === undefined, 'supplyIf should return undefined when predicate is not satisfied');
  });

  it('has idempotent open', () => {
    const waitable: Waitable<string> = createWaitable<string>({ initialValue: "hello" });

    using _using1 = waitable.open();
    {
      using _using2 = waitable.open();
    }

    ok(waitable.supply() === "hello", 'Value should remain unchanged after multiple opens');
  });

  it('closing Waitable multiple times should be idempotent', () => {
    const waitable: Waitable<string> = createWaitable<string>({ initialValue: "hello" });

    const close1: AutoClose = waitable.open();
    close1.close();
    close1.close(); // second close should be no-op
  
    ok(true, 'Closing Waitable multiple times should not throw exception'); 
  });

  it('closing Waitable with notifyWhile active should stop notifications', async () => {
    const waitable: Waitable<number> = createWaitable<number>({ initialValue: 0 });
    const closeWaitable: AutoClose = waitable.open();

    let notifications: number[] = [];

    const observer: Consumer<number> = {
      consume: (value: number) => {
        notifications.push(value);
      }
    };

    using _usingNotifyWhile = waitable.notifyWhile((val) => val < 5, observer);

    closeWaitable.close();
    notifications = []; // reset notifications  

    // Simulate value changes
    for (let i = 1; i <= 10; i++) {
      waitable.consume(i);
    }
    await new Promise((resolve, _) => setTimeout(resolve, 100));

    ok(notifications.length === 0, 'No notifications should be received after Waitable is closed');
  });

  it('closing notifyWhile should stop notifications', async () => {
    const waitable: Waitable<number> = createWaitable<number>({ initialValue: 0 });
    using _usingWaitable = waitable.open();

    let notifications: number[] = [];

    const observer: Consumer<number> = {
      consume: (value: number) => {
        notifications.push(value);
      }
    };

    const notifyWhileClose = waitable.notifyWhile((val) => val < 5, observer);

    // Simulate value changes
    for (let i = 1; i <= 10; i++) {
      waitable.consume(i);
    }
    await new Promise((resolve, _) => setTimeout(resolve, 100));

    notifyWhileClose.close();

    const notificationCount = notifications.length;

    // Further changes should not trigger notifications
    for (let i = 11; i <= 15; i++) {
      waitable.consume(i);
    }
    await new Promise((resolve, _) => setTimeout(resolve, 100));

    ok(notifications.length === notificationCount, 'No new notifications should be received after notifyWhile is closed');
  });

  it('supplyWhen when not open should reject with exception', async () => {
    const waitable: Waitable<number> = createWaitable<number>({ initialValue: 0 });

    let threwException = false;

    const promise = waitable.supplyWhen((val) => val === 10);
    await promise.catch(() => { threwException = true });

    ok(threwException, 'supplyWhen should reject with exception when Waitable is not open');
  });

  it('supplyWhen should wait for predicate to be satisfied and return value', async () => {
    const waitable: Waitable<number> = createWaitable<number>({ initialValue: 0 });
    using _usingWaitable = waitable.open();

    const promise = waitable.supplyWhen((val) => val === 10);

    // Simulate value changes
    for (let i = 1; i <= 10; i++) {
      waitable.consume(i);
    }

    const result = await promise;
    ok(result === 10, 'supplyWhen should return value when predicate is satisfied');
  });

    it('supplyWhen non changing values are skipped', async () => {
    const waitable: Waitable<number> = createWaitable<number>({ initialValue: 0 });
    using _usingWaitable = waitable.open();

    const promise = waitable.supplyWhen((val) => val === 10);

    // Simulate value changes
    for (let i = 1; i <= 10; i++) {
      waitable.consume(i);
      waitable.consume(i); // duplicate consume, should be skipped
    }

    const result = await promise;
    ok(result === 10, 'supplyWhen should return value when predicate is satisfied');
  });

  it('closing Waitable while supplyWhen ', async () => {
    const waitable: Waitable<number> = createWaitable<number>({ initialValue: 0 });
    const closeWaitable: AutoClose = waitable.open();
    const promise = waitable.supplyWhen((val) => val === 10);

    let rejected = false;
    promise.catch(() => { rejected = true; });
    closeWaitable.close();
    // Simulate value changes
    for (let i = 1; i <= 10; i++) {
      waitable.consume(i);
    }

    const result = await promise.catch(() => { rejected = true });
    ok(rejected, 'supplyWhen should be rejected when Waitable is closed before predicate is satisfied');
    ok(result === undefined, 'supplyWhen should return undefined when closed before predicate is satisfied');
  });

  it ('closing Waitable while consumeWhen is pending should reject the promise', async () => {
    const waitable: Waitable<number> = createWaitable<number>({ initialValue: 0 });
    const closeWaitable: AutoClose = waitable.open();
    const promise = waitable.consumeWhen((val) => val === 10, () => 20);

    let rejected = false;
    promise.catch(() => { rejected = true; });
    closeWaitable.close();

    // Simulate value changes
    for (let i = 1; i <= 10; i++) {
      waitable.consume(i);
    }

    await promise.catch(() => { rejected = true });
    ok(rejected, 'consumeWhen should be rejected when Waitable is closed before predicate is satisfied');
  });
});

assertGuard(guard,
  'open',
  'supply',
  'supplyIf',
  'supplyWhen',
  'consume',
  'consumeIf',
  'consumeWhen',
  'notifyWhile'
);


