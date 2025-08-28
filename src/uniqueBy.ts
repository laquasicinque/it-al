import type { IterFn } from "./_types";

export function uniqueBy<T>(
  iter: Iterable<T>,
  fn: IterFn<T>
): IterableIterator<T>;
export function uniqueBy<T>(fn: IterFn<T>): IterableIterator<T>;
export function uniqueBy<T>(
  fnOrIter: Iterable<T> | IterFn<T>,
  maybeFn?: IterFn<T>
) {
  if (typeof fnOrIter === "function") {
    return (iter: Iterable<T>) => _uniqueBy(iter, fnOrIter);
  }
  return _uniqueBy(fnOrIter, maybeFn!);
}

function* _uniqueBy<T>(iter: Iterable<T>, fn: IterFn<T>): IterableIterator<T> {
  const set = new Set();
  let i = 0;
  for (const item of iter) {
    const value = fn(item, i++);
    if (!set.has(value)) {
      yield item;
      set.add(value);
    }
  }
}
