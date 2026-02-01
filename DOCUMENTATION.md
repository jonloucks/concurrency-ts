# @jonloucks/concurrency-ts Documentation

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Core Concepts](#core-concepts)
  - [Concurrency](#concurrency)
  - [Waitable](#waitable)
  - [Completable](#completable)
  - [StateMachine](#statemachine)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
  - [Creating a Concurrency Instance](#creating-a-concurrency-instance)
  - [Working with Waitables](#working-with-waitables)
  - [Working with Completables](#working-with-completables)
  - [Working with State Machines](#working-with-state-machines)
- [Advanced Usage](#advanced-usage)
  - [Complete Later Pattern](#complete-later-pattern)
  - [Complete Now Pattern](#complete-now-pattern)
  - [State Machine Transitions](#state-machine-transitions)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Overview

`@jonloucks/concurrency-ts` is a TypeScript library that provides powerful abstractions for managing asynchronous concurrency, state machines, and completion patterns. It offers type-safe primitives for building concurrent applications with guaranteed completion semantics.

### Key Features

- **Type-safe concurrency primitives** - Fully typed interfaces for concurrent operations
- **Waitable references** - Thread-safe mutable references that allow waiting for condition changes
- **Completables** - Observe activities from start to finish with guaranteed completion
- **State machines** - User-defined states with transition rules and validation
- **Guaranteed execution** - Patterns ensuring completion callbacks are always invoked
- **Resource management** - Automatic cleanup via the `Open` interface

## Installation

```bash
npm install @jonloucks/concurrency-ts
```

## Core Concepts

### Concurrency

The `Concurrency` interface is the main entry point for creating concurrency primitives. It provides factory methods for creating `Waitable`, `Completable`, and `StateMachine` instances, along with guaranteed execution patterns.

**Key responsibilities:**
- Create concurrency primitives with proper configuration
- Manage resource lifecycle
- Provide guaranteed completion semantics

### Waitable

A `Waitable<T>` provides a mutable reference that allows threads to wait until the value satisfies a given condition. It combines supplier, consumer, and notification capabilities.

**Key characteristics:**
- Thread-safe value storage
- Notification mechanism for value changes
- Support for conditional waiting
- Implements `Open` for resource management

**Primary interfaces:**
- `WaitableSupplier<T>` - Provides the current value
- `WaitableConsumer<T>` - Accepts new values
- `WaitableNotify<T>` - Notifies waiting threads of changes

### Completable

A `Completable<T>` observes a single activity from start to finish, tracking its completion state and final value. It ensures that completion notifications are delivered exactly once.

**Key characteristics:**
- Tracks completion state (incomplete, succeeded, failed, canceled)
- Holds the final completion value
- Provides observables for state and value changes
- Guarantees exactly-once completion notification

**Completion states:**
- `INCOMPLETE` - Activity has not yet completed
- `SUCCEEDED` - Activity completed successfully with a value
- `FAILED` - Activity failed (potentially with an error)
- `CANCELED` - Activity was canceled before completion

### StateMachine

A `StateMachine<T>` manages user-defined states with rules restricting state transitions. It provides a type-safe way to model complex state-based behavior.

**Key characteristics:**
- User-defined state types
- Transition rules and validation
- Event-driven state changes
- Observable state changes via `WaitableNotify`
- Completion tracking when final states are reached

## Getting Started

### Basic Setup

```typescript
import { createConcurrency, Concurrency } from '@jonloucks/concurrency-ts';

// Create a Concurrency instance
const concurrency: Concurrency = createConcurrency({});

// Open it for use (returns AutoClose for cleanup)
using closeConcurrency = concurrency.open();

// Use the concurrency instance...
```

### Creating a Waitable

```typescript
import { Waitable } from '@jonloucks/concurrency-ts';

// Create a waitable with an initial value
const waitable: Waitable<number> = concurrency.createWaitable({
  initialValue: 42
});

using closeWaitable = waitable.open();

// Get the current value
const value = waitable.supply(); // 42

// Set a new value
waitable.consume(100);

// Get the notification interface
const notify = waitable.notify();
```

### Creating a Completable

```typescript
import { Completable } from '@jonloucks/concurrency-ts';

// Create a completable
const completable: Completable<string> = concurrency.createCompletable({});

using closeCompletable = completable.open();

// Check if completed
const isCompleted = completable.isCompleted(); // false

// Notify of successful completion
completable.notify({
  state: 'SUCCEEDED',
  value: 'Task completed successfully'
});

// Get the completion
const completion = completable.getCompletion();
console.log(completion?.value); // 'Task completed successfully'
```

### Creating a State Machine

```typescript
import { StateMachine, Rule } from '@jonloucks/concurrency-ts';

// Define states
type AppState = 'INITIAL' | 'RUNNING' | 'PAUSED' | 'STOPPED';

// Create state machine
const stateMachine: StateMachine<AppState> = concurrency.createStateMachine({
  initialValue: 'INITIAL',
  states: ['INITIAL', 'RUNNING', 'PAUSED', 'STOPPED'],
  getStateRules: (state: AppState): Rule<AppState>[] => {
    switch (state) {
      case 'INITIAL':
        return [{ event: 'start', allowedStates: ['RUNNING'] }];
      case 'RUNNING':
        return [
          { event: 'pause', allowedStates: ['PAUSED'] },
          { event: 'stop', allowedStates: ['STOPPED'] }
        ];
      case 'PAUSED':
        return [
          { event: 'resume', allowedStates: ['RUNNING'] },
          { event: 'stop', allowedStates: ['STOPPED'] }
        ];
      case 'STOPPED':
        return []; // Terminal state
      default:
        return [];
    }
  }
});

using closeStateMachine = stateMachine.open();

// Get current state
console.log(stateMachine.getState()); // 'INITIAL'

// Transition to a new state
stateMachine.setState('start', 'RUNNING');
console.log(stateMachine.getState()); // 'RUNNING'

// Check if transition is allowed
const canPause = stateMachine.isTransitionAllowed('pause', 'PAUSED'); // true
const canStop = stateMachine.isTransitionAllowed('invalid', 'STOPPED'); // false
```

## API Reference

### Creating a Concurrency Instance

```typescript
import { createConcurrency, Concurrency, ConcurrencyConfig } from '@jonloucks/concurrency-ts';
import { Contracts } from '@jonloucks/contracts-ts';

// Basic configuration
const concurrency1: Concurrency = createConcurrency({});

// With custom contracts
const contracts: Contracts = /* ... */;
const concurrency2: Concurrency = createConcurrency({
  contracts: contracts
});
```

**ConcurrencyConfig:**
- `contracts?: Contracts` - Optional contracts instance for validation

### Working with Waitables

#### Creating Waitables

```typescript
import { Waitable, WaitableConfig } from '@jonloucks/concurrency-ts';

// Without initial value
const waitable1: Waitable<string> = concurrency.createWaitable<string>({});

// With initial value
const waitable2: Waitable<number> = concurrency.createWaitable<number>({
  initialValue: 0
});

// With custom contracts
const waitable3: Waitable<boolean> = concurrency.createWaitable<boolean>({
  contracts: contracts,
  initialValue: false
});
```

**WaitableConfig<T>:**
- `contracts?: Contracts` - Optional contracts for validation
- `initialValue?: T` - Optional initial value

#### Using Waitables

```typescript
// Supply (get) the current value
const currentValue = waitable.supply();

// Consume (set) a new value
waitable.consume(newValue);

// Get the notification interface
const notifier = waitable.notify();

// Wait for a condition to be met (via notification)
notifier.wait((value) => value > 10);
```

### Working with Completables

#### Creating Completables

```typescript
import { Completable, CompletableConfig } from '@jonloucks/concurrency-ts';

// Basic completable
const completable1: Completable<string> = concurrency.createCompletable({});

// With initial value
const completable2: Completable<number> = concurrency.createCompletable({
  initialValue: 0
});
```

**CompletableConfig<T>:**
- `contracts?: Contracts` - Optional contracts for validation
- `initialValue?: T` - Optional initial value

#### Using Completables

```typescript
// Check if completed
if (!completable.isCompleted()) {
  // Notify of completion
  completable.notify({
    state: 'SUCCEEDED',
    value: result
  });
}

// Get the completion
const completion = completable.getCompletion();
if (completion) {
  console.log('State:', completion.state);
  console.log('Value:', completion.value);
}

// Observe state changes
const stateNotifier = completable.notifyState();

// Observe value changes
const valueNotifier = completable.notifyValue();

// Register completion callback
completable.onCompletion((completion) => {
  if (completion.state === 'SUCCEEDED') {
    console.log('Success:', completion.value);
  } else if (completion.state === 'FAILED') {
    console.error('Failed:', completion.value);
  }
});
```

### Working with State Machines

#### Creating State Machines

```typescript
import { StateMachine, StateMachineConfig, Rule } from '@jonloucks/concurrency-ts';

type MyState = 'STATE_A' | 'STATE_B' | 'STATE_C';

const stateMachine: StateMachine<MyState> = concurrency.createStateMachine({
  initialValue: 'STATE_A',
  states: ['STATE_A', 'STATE_B', 'STATE_C'],
  getStateRules: (state: MyState): Rule<MyState>[] => {
    // Define allowed transitions for each state
    if (state === 'STATE_A') {
      return [{ event: 'move', allowedStates: ['STATE_B'] }];
    } else if (state === 'STATE_B') {
      return [
        { event: 'forward', allowedStates: ['STATE_C'] },
        { event: 'back', allowedStates: ['STATE_A'] }
      ];
    }
    return [];
  }
});
```

**StateMachineConfig<T>:**
- `contracts?: Contracts` - Optional contracts for validation
- `initialValue: T` - Required initial state (must be in states array)
- `states: Array<T>` - Array of all valid states
- `getStateRules?: (state: T) => Rule<T>[]` - Function to get transition rules for a state

**Rule<T>:**
- `event: string` - The event name that triggers the transition
- `allowedStates: T[]` - Array of states this transition can move to

#### Using State Machines

```typescript
// Get current state
const currentState = stateMachine.getState();

// Check if a state exists
const hasState = stateMachine.hasState('STATE_B'); // true

// Check if transition is allowed
const isAllowed = stateMachine.isTransitionAllowed('move', 'STATE_B');

// Set state (must be allowed transition)
const changed = stateMachine.setState('move', 'STATE_B');

// Execute a transition with callback
const result = stateMachine.transition({
  event: 'forward',
  state: 'STATE_C',
  execute: (fromState, toState) => {
    console.log(`Transitioning from ${fromState} to ${toState}`);
    return { success: true };
  }
});

// Observe state changes
const stateNotifier = stateMachine.notify();

// Check if state machine has reached a final state
const isComplete = stateMachine.isCompleted();
```

## Advanced Usage

### Complete Later Pattern

The `completeLater` method ensures guaranteed execution of completion callbacks, even if the delegate fails to take ownership:

```typescript
import { OnCompletion } from '@jonloucks/concurrency-ts';

// Create an OnCompletion callback
const onCompletion: OnCompletion<string> = {
  onCompletion: (completion) => {
    console.log('Completion received:', completion);
  }
};

// Delegate that will receive the callback
const delegate = (callback: OnCompletion<string>) => {
  // Process the callback
  // If this throws or fails, the callback still gets a FAILED completion
  callback.onCompletion({ state: 'SUCCEEDED', value: 'Done' });
};

// Guaranteed execution
concurrency.completeLater(onCompletion, delegate);
```

**Key guarantees:**
- Either the delegate successfully takes ownership of the OnCompletion, OR
- A final FAILED completion is dispatched
- The completion callback will always be invoked exactly once

### Complete Now Pattern

The `completeNow` method provides guaranteed execution for synchronous completion blocks:

```typescript
import { OnCompletion } from '@jonloucks/concurrency-ts';

const onCompletion: OnCompletion<number> = {
  onCompletion: (completion) => {
    console.log('Completion:', completion);
  }
};

// Execute a block that produces a completion value
const result = concurrency.completeNow(onCompletion, () => {
  // Your synchronous work here
  const value = performCalculation();
  
  if (value < 0) {
    throw new Error('Invalid value');
  }
  
  return value;
});

// Result contains the value if successful
console.log('Result:', result);
```

**Key guarantees:**
- When the method finishes, the OnCompletion has received a final completion
- Exceptions result in a FAILED completion
- Exceptions are re-thrown after the completion notification
- The completion callback is always invoked exactly once

### State Machine Transitions

Advanced state machine usage with transition callbacks:

```typescript
import { Transition } from '@jonloucks/concurrency-ts';

type WorkflowState = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

const workflow: StateMachine<WorkflowState> = concurrency.createStateMachine({
  initialValue: 'PENDING',
  states: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'],
  getStateRules: (state) => {
    switch (state) {
      case 'PENDING':
        return [{ event: 'start', allowedStates: ['IN_PROGRESS'] }];
      case 'IN_PROGRESS':
        return [
          { event: 'complete', allowedStates: ['COMPLETED'] },
          { event: 'fail', allowedStates: ['FAILED'] }
        ];
      default:
        return [];
    }
  }
});

using closeWorkflow = workflow.open();

// Execute transition with side effects
const transitionData = workflow.transition<{ timestamp: number }>({
  event: 'start',
  state: 'IN_PROGRESS',
  execute: (fromState, toState) => {
    console.log(`Starting workflow: ${fromState} -> ${toState}`);
    
    // Perform side effects
    notifyMonitoring('workflow_started');
    
    // Return transition metadata
    return {
      timestamp: Date.now()
    };
  }
});

console.log('Workflow started at:', transitionData?.timestamp);
```

## Best Practices

### 1. Always Use Resource Management

Use the `using` keyword or manually call `close()` to ensure proper cleanup:

```typescript
// Recommended: using keyword (automatic cleanup)
{
  using closeConcurrency = concurrency.open();
  // Use concurrency...
} // Automatically closed

// Alternative: manual cleanup
const closeConcurrency = concurrency.open();
try {
  // Use concurrency...
} finally {
  closeConcurrency.close();
}
```

### 2. Type Safety

Leverage TypeScript's type system for compile-time safety:

```typescript
// Define explicit types for your states
type ConnectionState = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

const connection: StateMachine<ConnectionState> = concurrency.createStateMachine({
  initialValue: 'DISCONNECTED',
  states: ['DISCONNECTED', 'CONNECTING', 'CONNECTED', 'ERROR'],
  // TypeScript ensures all states are ConnectionState
  getStateRules: (state: ConnectionState) => { /* ... */ }
});
```

### 3. Completion Guarantees

Use `completeLater` and `completeNow` patterns for guaranteed completion:

```typescript
// BAD: Completion might not be called if error occurs
try {
  const result = await doAsyncWork();
  onCompletion.onCompletion({ state: 'SUCCEEDED', value: result });
} catch (error) {
  // onCompletion might not be called!
}

// GOOD: Guaranteed completion
concurrency.completeLater(onCompletion, async (callback) => {
  const result = await doAsyncWork();
  callback.onCompletion({ state: 'SUCCEEDED', value: result });
});
```

### 4. State Machine Design

Design state machines with clear terminal states:

```typescript
type TaskState = 'CREATED' | 'RUNNING' | 'COMPLETED' | 'FAILED';

// Terminal states should not have outgoing transitions
getStateRules: (state: TaskState) => {
  switch (state) {
    case 'CREATED':
      return [{ event: 'start', allowedStates: ['RUNNING'] }];
    case 'RUNNING':
      return [
        { event: 'succeed', allowedStates: ['COMPLETED'] },
        { event: 'fail', allowedStates: ['FAILED'] }
      ];
    case 'COMPLETED':
    case 'FAILED':
      return []; // Terminal states - no outgoing transitions
  }
}
```

### 5. Error Handling

Handle errors appropriately in completion callbacks:

```typescript
const completable = concurrency.createCompletable<Result>();

completable.onCompletion((completion) => {
  if (completion.state === 'SUCCEEDED') {
    processSuccess(completion.value);
  } else if (completion.state === 'FAILED') {
    logError('Task failed', completion.value);
  } else if (completion.state === 'CANCELED') {
    logInfo('Task was canceled');
  }
});
```

### 6. Waitable Conditions

Use meaningful conditions when waiting on waitable values:

```typescript
const counter: Waitable<number> = concurrency.createWaitable({ initialValue: 0 });

// Wait for specific condition
const notifier = counter.notify();
notifier.wait((value) => value >= 10);

// Update value from another part of the code
counter.consume(counter.supply() + 1);
```

## Examples

### Example 1: Async Task Tracker

Track the progress of asynchronous tasks:

```typescript
import { createConcurrency, Completable } from '@jonloucks/concurrency-ts';

const concurrency = createConcurrency({});
using closeConcurrency = concurrency.open();

async function trackTask<T>(
  taskName: string,
  task: () => Promise<T>
): Promise<T> {
  const completable: Completable<T> = concurrency.createCompletable({});
  using closeCompletable = completable.open();
  
  completable.onCompletion((completion) => {
    console.log(`Task ${taskName}:`, completion.state);
  });
  
  return concurrency.completeNow(completable, () => {
    return task();
  });
}

// Use it
const result = await trackTask('fetchData', async () => {
  const response = await fetch('https://api.example.com/data');
  return response.json();
});
```

### Example 2: Connection State Machine

Model a network connection with a state machine:

```typescript
import { createConcurrency, StateMachine, Rule } from '@jonloucks/concurrency-ts';

type ConnectionState = 
  | 'DISCONNECTED' 
  | 'CONNECTING' 
  | 'CONNECTED' 
  | 'DISCONNECTING'
  | 'ERROR';

const concurrency = createConcurrency({});
using closeConcurrency = concurrency.open();

const connectionStateMachine: StateMachine<ConnectionState> = 
  concurrency.createStateMachine({
    initialValue: 'DISCONNECTED',
    states: ['DISCONNECTED', 'CONNECTING', 'CONNECTED', 'DISCONNECTING', 'ERROR'],
    getStateRules: (state: ConnectionState): Rule<ConnectionState>[] => {
      switch (state) {
        case 'DISCONNECTED':
          return [{ event: 'connect', allowedStates: ['CONNECTING'] }];
        case 'CONNECTING':
          return [
            { event: 'connected', allowedStates: ['CONNECTED'] },
            { event: 'error', allowedStates: ['ERROR'] },
            { event: 'cancel', allowedStates: ['DISCONNECTED'] }
          ];
        case 'CONNECTED':
          return [
            { event: 'disconnect', allowedStates: ['DISCONNECTING'] },
            { event: 'error', allowedStates: ['ERROR'] }
          ];
        case 'DISCONNECTING':
          return [{ event: 'disconnected', allowedStates: ['DISCONNECTED'] }];
        case 'ERROR':
          return [{ event: 'reset', allowedStates: ['DISCONNECTED'] }];
        default:
          return [];
      }
    }
  });

using closeConnection = connectionStateMachine.open();

// Use the state machine
async function connect() {
  if (connectionStateMachine.getState() === 'DISCONNECTED') {
    connectionStateMachine.setState('connect', 'CONNECTING');
    
    try {
      await performConnection();
      connectionStateMachine.setState('connected', 'CONNECTED');
    } catch (error) {
      connectionStateMachine.setState('error', 'ERROR');
    }
  }
}
```

### Example 3: Producer-Consumer with Waitable

Use waitables for producer-consumer patterns:

```typescript
import { createConcurrency, Waitable } from '@jonloucks/concurrency-ts';

interface Queue<T> {
  items: T[];
}

const concurrency = createConcurrency({});
using closeConcurrency = concurrency.open();

const queue: Waitable<Queue<string>> = concurrency.createWaitable({
  initialValue: { items: [] }
});

using closeQueue = queue.open();

// Producer
async function produce(item: string) {
  const current = queue.supply();
  current.items.push(item);
  queue.consume(current);
}

// Consumer
async function consume(): Promise<string | undefined> {
  const notifier = queue.notify();
  
  // Wait for items to be available
  await notifier.wait((q) => q.items.length > 0);
  
  const current = queue.supply();
  const item = current.items.shift();
  queue.consume(current);
  
  return item;
}

// Usage
await produce('message1');
await produce('message2');

const item1 = await consume(); // 'message1'
const item2 = await consume(); // 'message2'
```

### Example 4: Multi-Step Workflow

Combine multiple primitives for complex workflows:

```typescript
import { 
  createConcurrency, 
  Completable, 
  StateMachine 
} from '@jonloucks/concurrency-ts';

type WorkflowStep = 'INIT' | 'STEP1' | 'STEP2' | 'STEP3' | 'DONE';

class Workflow {
  private concurrency = createConcurrency({});
  private stateMachine: StateMachine<WorkflowStep>;
  private stepCompletables: Map<WorkflowStep, Completable<any>>;

  constructor() {
    using closeConcurrency = this.concurrency.open();
    
    this.stateMachine = this.concurrency.createStateMachine({
      initialValue: 'INIT',
      states: ['INIT', 'STEP1', 'STEP2', 'STEP3', 'DONE'],
      getStateRules: (state) => {
        switch (state) {
          case 'INIT':
            return [{ event: 'start', allowedStates: ['STEP1'] }];
          case 'STEP1':
            return [{ event: 'next', allowedStates: ['STEP2'] }];
          case 'STEP2':
            return [{ event: 'next', allowedStates: ['STEP3'] }];
          case 'STEP3':
            return [{ event: 'complete', allowedStates: ['DONE'] }];
          default:
            return [];
        }
      }
    });
    
    this.stepCompletables = new Map();
  }

  async executeStep(step: WorkflowStep, work: () => Promise<any>) {
    const completable = this.concurrency.createCompletable({});
    this.stepCompletables.set(step, completable);
    
    using closeCompletable = completable.open();
    
    return this.concurrency.completeNow(completable, async () => {
      const result = await work();
      return result;
    });
  }

  async run() {
    this.stateMachine.setState('start', 'STEP1');
    await this.executeStep('STEP1', async () => {
      console.log('Executing Step 1');
      await delay(1000);
    });
    
    this.stateMachine.setState('next', 'STEP2');
    await this.executeStep('STEP2', async () => {
      console.log('Executing Step 2');
      await delay(1000);
    });
    
    this.stateMachine.setState('next', 'STEP3');
    await this.executeStep('STEP3', async () => {
      console.log('Executing Step 3');
      await delay(1000);
    });
    
    this.stateMachine.setState('complete', 'DONE');
    console.log('Workflow completed!');
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Usage
const workflow = new Workflow();
await workflow.run();
```

## Additional Resources

- [TypeDoc API Documentation](https://jonloucks.github.io/concurrency-ts/typedoc/)
- [Test Coverage Report](https://jonloucks.github.io/concurrency-ts/lcov-report)
- [GitHub Repository](https://github.com/jonloucks/concurrency-ts)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security Policy](SECURITY.md)

## Support

For questions, issues, or feature requests, please:
1. Check the [TypeDoc API Documentation](https://jonloucks.github.io/concurrency-ts/typedoc/)
2. Search existing [GitHub Issues](https://github.com/jonloucks/concurrency-ts/issues)
3. Create a new issue using the appropriate template

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
