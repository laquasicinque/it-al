import type { IterFn } from "./_types";

/**
 * Takes items while a predicate is true, then stops.
 * @example
 * ```ts
 * [...takeWhile([1,2,3,4], x => x < 3)] // [1, 2]
 * [...takeWhile(x => x < 4)([1,2,3,4,5])] // [1, 2, 3]
 * ```
 */
export function takeWhile<T>(
  fn: IterFn<T>
): (iter: Iterable<T>) => IterableIterator<T>;
export function takeWhile<T>(
  iter: Iterable<T>,
  fn: IterFn<T>
): IterableIterator<T>;
export function takeWhile<T>(
  fnOrIter: IterFn<T> | Iterable<T>,
  maybeFn?: IterFn<T>
): IterableIterator<T> | ((iter: Iterable<T>) => IterableIterator<T>) {
  if (typeof fnOrIter === "function") {
    // Curried form: return a function that takes an iterable
    return (iter: Iterable<T>) => _takeWhile(iter, fnOrIter);
  }
  // Direct form: take while predicate is true
  return _takeWhile(fnOrIter, maybeFn!);
}

function* _takeWhile<T>(iter: Iterable<T>, fn: IterFn<T>): IterableIterator<T> {
  let i = 0;
  for (const item of iter) {
    if (fn(item, i++)) yield item;
    else return;
  }
}
