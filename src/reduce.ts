/**
 * Map function for iterables with currying support
 */
export function reduce<T, U>(
  iter: Iterable<T>,
  fn: (acc: U, item: T, index: number) => U,
  start: U
): U;
export function reduce<T, U>(
  fn: (acc: U, item: T, index: number) => U
): (iter: Iterable<T>, start?: U) => U;
export function reduce<T, U>(
  fnOrIter: ((acc: U, item: T, index: number) => U) | Iterable<T>,
  maybeFn?: (acc: U, item: T, index: number) => U,
  start?: U
): U | ((iter: Iterable<T>, start?: U) => U) {
  if (typeof fnOrIter === "function") {
    // Curried form: return a function that takes an iterable
    return function (...args: [iter: Iterable<T>, start?: U]) {
      const argsWithFn: unknown[] = [...args];
      argsWithFn.splice(1, 0, fnOrIter);
      return _reduce(...(argsWithFn as Parameters<typeof _reduce>)) as U;
    };
  }
  // Direct form: map the iterable with the function
  return arguments.length === 2
    ? _reduce(fnOrIter, maybeFn!)
    : _reduce(fnOrIter, maybeFn!, start as U);
}

function _reduce<T, U>(
  ...args: [
    iter: Iterable<T>,
    fn: (acc: U, item: T, index: number) => U,
    start?: U,
  ]
): U {
  const [iter, fn, start] = args;
  let i = 0;
  let carry: U | T = start as U;
  for (const item of iter) {
    if (i === 0 && arguments.length == 2) carry = item;
    else carry = fn(carry as U, item, i);
    i++;
  }
  return carry as U;
}
