import type { CurriedFn } from "./_types";

/**
 * Map function for iterables with currying support
 */
export function scan<T, U>(
  iter: Iterable<T>,
  fn: (acc: U, item: T, index: number) => U,
  start?: U
): IterableIterator<U>;
export function scan<T, U>(
  fn: (acc: U, item: T, index: number) => U,
  start?: U
): CurriedFn<T, IterableIterator<U>>;
export function scan<T, U>(
  ...args: [
    fnOrIter: ((acc: U, item: T, index: number) => U) | Iterable<T>,
    maybeFn?: (acc: U, item: T, index: number) => U,
    start?: U,
  ]
): IterableIterator<U> | CurriedFn<T, IterableIterator<U>> {
  const [fnOrIter, maybeFn, start] = args;
  if (typeof fnOrIter === "function") {
    // Curried form: return a function that takes an iterable
    return function (...args: [iter: Iterable<T>, start?: U]) {
      const [iter, start] = args;
      return args.length === 1
        ? _scan(iter, fnOrIter)
        : _scan(iter, fnOrIter, start as U);
    };
  }
  // Direct form: map the iterable with the function
  return args.length === 2
    ? _scan(fnOrIter, maybeFn!)
    : _scan(fnOrIter, maybeFn!, start as U);
}

function* _scan<T, U>(
  ...args: [
    iter: Iterable<T>,
    fn: (acc: U, item: T, index: number) => U,
    start?: U,
  ]
): IterableIterator<U> {
  const [iter, fn, start] = args;
  let i = 0;
  let carry: U | T = start as U;
  for (const item of iter) {
    if (i === 0 && args.length == 2) carry = item;
    else carry = fn(carry as U, item, i);
    yield carry as U;
    i++;
  }
}
