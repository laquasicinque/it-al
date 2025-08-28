import type { IterFn } from "./_types";

/**
 * Map function for iterables with currying support
 */
export function map<T, U>(
  iter: Iterable<T>,
  fn: IterFn<T, U>
): IterableIterator<U>;
export function map<T, U>(
  fn: IterFn<T, U>
): (iter: Iterable<T>) => IterableIterator<U>;
export function map<T, U>(
  fnOrIter: IterFn<T, U> | Iterable<T>,
  maybeFn?: IterFn<T, U>
): IterableIterator<U> | ((iter: Iterable<T>) => IterableIterator<U>) {
  if (typeof fnOrIter === "function") {
    // Curried form: return a function that takes an iterable
    return (iter: Iterable<T>) => _map(iter, fnOrIter);
  }
  // Direct form: map the iterable with the function
  return _map(fnOrIter, maybeFn!);
}

function* _map<T, U>(iter: Iterable<T>, fn: IterFn<T, U>): IterableIterator<U> {
  let i = 0;
  for (const item of iter) {
    yield fn(item, i++);
  }
}
