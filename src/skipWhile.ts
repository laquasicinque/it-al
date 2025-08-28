import type { IterFn } from "./_types";

/**
 * Skips items while a predicate is true, then yields remaining items.
 * @example
 * ```ts
 * [...skipWhile([1,2,3,4], x => x < 3)] // [3, 4]
 * [...skipWhile(x => x < 2)([1,2,3])] // [2, 3]
 * ```
 */
export function skipWhile<T>(
  fn: IterFn<T>
): (iter: Iterable<T>) => IterableIterator<T>;
export function skipWhile<T>(
  iter: Iterable<T>,
  fn: IterFn<T>
): IterableIterator<T>;
export function skipWhile<T>(
  fnOrIter: IterFn<T> | Iterable<T>,
  maybeFn?: IterFn<T>
): IterableIterator<T> | ((iter: Iterable<T>) => IterableIterator<T>) {
  if (typeof fnOrIter === "function") {
    // Curried form: return a function that takes an iterable
    return (iter: Iterable<T>) => _skipWhile(iter, fnOrIter);
  }
  // Direct form: skip while predicate is true
  return _skipWhile(fnOrIter, maybeFn!);
}

function* _skipWhile<T>(iter: Iterable<T>, fn: IterFn<T>): IterableIterator<T> {
  let i = 0;
  let shouldYield = false;
  for (const item of iter) {
    if (!shouldYield && !fn(item, i++)) shouldYield = true;
    if (shouldYield) yield item;
  }
}
