/**
 * Skips the first `count` items from an iterable.
 * @example
 * ```ts
 * [...skip([1,2,3,4], 2)] // [3, 4]
 * [...skip(2)([1,2,3,4,5])] // [3, 4, 5]
 * ```
 */
export function skip<T>(
  count: number
): (iter: Iterable<T>) => IterableIterator<T>;
export function skip<T>(
  iter: Iterable<T>,
  count: number
): IterableIterator<T>;
export function skip<T>(
  countOrIter: number | Iterable<T>,
  maybeCount?: number
): IterableIterator<T> | ((iter: Iterable<T>) => IterableIterator<T>) {
  if (typeof countOrIter === "number") {
    // Curried form: return a function that takes an iterable
    return (iter: Iterable<T>) => _skip(iter, countOrIter);
  }
  // Direct form: skip count items
  return _skip(countOrIter, maybeCount!);
}

function* _skip<T>(iter: Iterable<T>, count: number): IterableIterator<T> {
  let i = 0;
  for (const item of iter) {
    if (i++ < count) continue;
    yield item;
  }
}
