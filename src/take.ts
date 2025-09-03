/**
 * Takes the first `n` items from an iterable.
 * @example
 * ```ts
 * [...take([1,2,3,4], 2)] // [1, 2]
 * [...take(3)([1,2,3,4,5])] // [1, 2, 3]
 * ```
 */
export function take<T>(
  n: number
): (iter: Iterable<T>) => IterableIterator<T>;
export function take<T>(
  iter: Iterable<T>,
  n: number
): IterableIterator<T>;
export function take<T>(
  nOrIter: number | Iterable<T>,
  maybeN?: number
): IterableIterator<T> | ((iter: Iterable<T>) => IterableIterator<T>) {
  if (typeof nOrIter === "number") {
    // Curried form: return a function that takes an iterable
    return (iter: Iterable<T>) => _take(iter, nOrIter);
  }
  // Direct form: take n items
  return _take(nOrIter, maybeN!);
}

function* _take<T>(iter: Iterable<T>, n: number): IterableIterator<T> {
  let i = 0;
  for (const item of iter) {
    if (i++ >= n) break;
    yield item;
  }
}
