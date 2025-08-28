import type { CurriedFn, IterFn } from "./_types";

// technically this could just be first(filter())
export function find<T, U extends T = T>(
  iter: Iterable<T>,
  fn: IterFn<T>
): U | null;
export function find<T, U extends T = T>(fn: IterFn<T>): CurriedFn<T, U | null>;
export function find<T, U extends T = T>(
  iterOrFn: Iterable<T> | IterFn<T>,
  maybeFn?: IterFn<T>
): U | null | CurriedFn<T, U | null> {
  if (typeof iterOrFn === "function")
    return (iter: Iterable<T>) => _find<T, U>(iter, iterOrFn);
  return _find<T, U>(iterOrFn, maybeFn!);
}

function _find<T, U extends T = T>(iter: Iterable<T>, fn: IterFn<T>) {
  let i = 0;
  for (const item of iter) {
    if (fn(item, i++)) return item as U;
  }
  return null;
}
