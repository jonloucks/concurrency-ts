import { ExposedPromise } from "./ExposedPromise";

export function create<T>(): ExposedPromise<T> {
  return ExposedPromiseImpl.internalCreate<T>();
}

// ---- Implementation details below ----

class ExposedPromiseImpl<T> implements ExposedPromise<T> {

  getPromise(): Promise<T> {
    return this.promise;
  }

  resolve!: (value: T | PromiseLike<T>) => void;

  reject!: (reason?: unknown) => void;

  static internalCreate<T>(): ExposedPromise<T> {
    return new ExposedPromiseImpl<T>()
  }

  private constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      // Capture the resolve and reject functions from the Promise constructor
      this.resolve = resolve;
      this.reject = reject;
    });
    // The resolve and reject methods can now be called from outside the constructor scope
  }
  private readonly promise: Promise<T>;
}