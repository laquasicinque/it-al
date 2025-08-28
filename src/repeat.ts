/**
 * Repeats an iterable a specified number of times
 * @param iter The iterable to repeat
 * @param times The number of times to repeat the iterable
 * @example
 * ```ts
 * [...repeat([1, 2], 3)] // [1, 2, 1, 2, 1, 2]
 * [...repeat('ab', 2)] // ['a', 'b', 'a', 'b']
 * ```
 */
export function repeat<T>(iter: Iterable<T>, times: number): IterableIterator<T>;
export function repeat<T>(times: number): (iter: Iterable<T>) => IterableIterator<T>;
export function repeat<T>(
  iterOrTimes: Iterable<T> | number,
  maybeTimes?: number
): IterableIterator<T> | ((iter: Iterable<T>) => IterableIterator<T>) {
  if (typeof iterOrTimes === 'number') {
    // Curried form: repeat(times)
    return (iter: Iterable<T>) => _repeat(iter, iterOrTimes);
  }
  
  // Direct form: repeat(iter, times)
  return _repeat(iterOrTimes, maybeTimes!);
}

function* _repeat<T>(iter: Iterable<T>, times: number): IterableIterator<T> {
  // Cache the values from the first iteration
  const cache: T[] = [...iter];
  
  for (let i = 0; i < times; i++) {
    yield* cache;
  }
}