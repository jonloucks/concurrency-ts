import { Consumer, Type as ConsumerType, fromType as fromTypeToConsumer } from "@jonloucks/concurrency-ts/auxiliary/Consumer";
import { OnCompletion } from "@jonloucks/concurrency-ts/api/OnCompletion";
import { RequiredType, OptionalType, Throwable } from "@jonloucks/concurrency-ts/api/Types";
import { onCompletionCheck } from "@jonloucks/concurrency-ts/auxiliary/Checks";
import { CompletionState } from "@jonloucks/concurrency-ts/api/Completion";

import { create as createCompletionImpl } from "./Completion.impl";

/**
 * Completes the given OnCompletion later by delegating to the provided delegate.
 * If the delegate throws, the OnCompletion is completed with FAILED state.
 *
 * @param onCompletion The OnCompletion to complete
 * @param delegate The delegate to which completion is delegated
 */
export function completeLater<T>(onCompletion: RequiredType<OnCompletion<T>>, delegate: RequiredType<ConsumerType<OnCompletion<T>>>): void {
  const validOnCompletion = onCompletionCheck(onCompletion); // only validate onCompletion here
  let state: CompletionState = 'PENDING';
  let thrown: OptionalType<Throwable<unknown>> = undefined;
  let value: OptionalType<T> = undefined;
  let delegated: boolean = false;

  try {
    const validDelegate: Consumer<OnCompletion<T>> = fromTypeToConsumer(delegate);
    validDelegate.consume(onCompletion); // ownership transferred
    delegated = true;
  } catch (caught) {
    thrown = caught;
    state = 'FAILED';
    throw thrown;
  } finally {
    if (!delegated) {
      validOnCompletion.onCompletion(createCompletionImpl<T>({ state, thrown, value }));
    }
  }
}