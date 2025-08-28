import type { CurriedFn, IterFn } from "./_types";
import { isNonStringIterable } from "./isIterable";

export function groupBy<T, U>(
  iter: Iterable<T>,
  fn: IterFn<T, U> | keyof T
): Map<U, T[]>;
export function groupBy<T, U>(
  fn: IterFn<T, U> | keyof T
): CurriedFn<T, Map<U, T[]>>;
export function groupBy<T, U>(
  fnOrIter: Iterable<T> | IterFn<T, U> | keyof T,
  maybeFn?: IterFn<T, U> | keyof T
): Map<U, T[]> | CurriedFn<T, Map<U, T[]>> {
  if (isNonStringIterable(fnOrIter)) {
    return _groupBy(fnOrIter as Iterable<T>, maybeFn!);
  }
  return (iter: Iterable<T>) => _groupBy(iter, fnOrIter);
}

function _groupBy<T, U>(
  iter: Iterable<T>,
  fnOrKey: IterFn<T, U> | keyof T
): Map<U, T[]> {
  const output = new Map<U, T[]>();
  const fn =
    typeof fnOrKey === "function" ? fnOrKey : (item: T) => item[fnOrKey] as U;
  let i = 0;
  for (const item of iter) {
    const groupedByVal = fn(item, i++);
    if (output.has(groupedByVal)) {
      const group = output.get(groupedByVal) ?? [];
      group.push(item);
    } else {
      const group = [item];
      output.set(groupedByVal, group);
    }
  }
  return output;
}
