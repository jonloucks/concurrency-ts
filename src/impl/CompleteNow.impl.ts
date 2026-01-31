import { Supplier, Type as SupplierType, fromType as fromTypeToSupplier } from "@jonloucks/concurrency-ts/auxiliary/Supplier";
import { RequiredType, OptionalType, Throwable } from "@jonloucks/concurrency-ts/api/Types";
import { OnCompletion } from "@jonloucks/concurrency-ts/api/OnCompletion";
import { onCompletionCheck } from "@jonloucks/concurrency-ts/auxiliary/Checks";
import { CompletionState } from "@jonloucks/concurrency-ts/api/CompletionState";

import { create as createCompletionImpl } from "./Completion.impl";

/**
 * Completes the given OnCompletion immediately with the result of the successBlock.
 * If the successBlock throws, the OnCompletion is completed with FAILED state.
 *
 * @param onCompletion The OnCompletion to complete
 * @param successBlock The block to execute to obtain the success value
 * @returns The value returned by the successBlock if successful, otherwise undefined
 * @throws Rethrows any exception thrown by the successBlock
 */
export function completeNow<T>(onCompletion: RequiredType<OnCompletion<T>>, successBlock: RequiredType<SupplierType<T>>): OptionalType<T> {
  const validOnCompletion = onCompletionCheck(onCompletion); // only validate onCompletion here
  let state!: CompletionState;
  let thrown: OptionalType<Throwable<unknown>> = undefined;
  let value: OptionalType<T> = undefined;

  try {
    // validate and execute successBlock
    const validSupplier: Supplier<T> = fromTypeToSupplier(successBlock);
    value = validSupplier.supply();
    state = 'SUCCEEDED';
    return value;
  } catch (caught) {
    thrown = caught;
    state = 'FAILED';
    throw thrown;
  } finally {
    validOnCompletion.onCompletion(createCompletionImpl<T>({ state, thrown, value }));
  }
}

