/**
 * Creates an infinite iterator that cycles through the elements of an iterable
 * @param iter The iterable to cycle through
 * @example
 * ```ts
 * [...take(cycle([1, 2, 3]), 7)] // [1, 2, 3, 1, 2, 3, 1]
 * [...take(cycle('abc'), 5)] // ['a', 'b', 'c', 'a', 'b']
 * ```
 */
export function* cycle<T>(iter: Iterable<T>): IterableIterator<T> {
  // Cache the values from the first iteration
  const cache: T[] = [...iter];
  
  if (cache.length === 0) {
    return; // Empty iterable, nothing to cycle
  }
  
  while (true) {
    yield* cache;
  }
}