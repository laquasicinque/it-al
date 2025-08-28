import type { CurriedFn, IterFn } from "./_types";

export function tap<T>(iter: Iterable<T>, fn: IterFn<T>): IterableIterator<T>;
export function tap<T>(fn: IterFn<T>): CurriedFn<T, IterableIterator<T>>;
export function tap<T>(
  iterOrFn: Iterable<T> | IterFn<T>,
  maybeFn?: IterFn<T>
): IterableIterator<T> | CurriedFn<T, IterableIterator<T>> {
  if (typeof iterOrFn === "function")
    return (iter: Iterable<T>) => _tap(iter, iterOrFn);
  return _tap(iterOrFn, maybeFn!);
}

function* _tap<T>(iter: Iterable<T>, fn: IterFn<T>) {
  let i = 0;
  for (const item of iter) {
    fn(item, i++);
    yield item;
  }
  return false;
}
