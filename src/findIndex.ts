import type { CurriedFn, IterFn } from "./_types";

export function findIndex<T>(iter: Iterable<T>, fn: IterFn<T>): number;
export function findIndex<T>(fn: IterFn<T>): CurriedFn<T, number>;
export function findIndex<T>(
  iterOrFn: Iterable<T> | IterFn<T>,
  maybeFn?: IterFn<T>
): number | CurriedFn<T, number> {
  if (typeof iterOrFn === "function")
    return (iter: Iterable<T>) => _findIndex(iter, iterOrFn);
  return _findIndex(iterOrFn, maybeFn!);
}

function _findIndex<T>(iter: Iterable<T>, fn: IterFn<T>) {
  let i = 0;
  for (const item of iter) {
    if (fn(item, i)) return i;
    i++;
  }
  return -1;
}
