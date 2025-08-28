import type { IterFn } from "./_types";

/**
 * Tests whether at least one item in an iterable passes a predicate function.
 * @example
 * ```ts
 * some([1,3,5], x => x % 2 === 0) // false
 * some(x => x > 2)([1,2,3]) // true
 * ```
 */
export function some<T>(predicate: IterFn<T>): (iter: Iterable<T>) => boolean;
export function some<T>(iter: Iterable<T>, predicate: IterFn<T>): boolean;
export function some<T>(
  predicateOrIter: IterFn<T> | Iterable<T>,
  maybePredicate?: IterFn<T>
): boolean | ((iter: Iterable<T>) => boolean) {
  if (typeof predicateOrIter === "function") {
    // Curried form: return a function that takes an iterable
    return (iter: Iterable<T>) => _some(iter, predicateOrIter);
  }
  // Direct form: test some items in the iterable
  return _some(predicateOrIter, maybePredicate!);
}

function _some<T>(iter: Iterable<T>, predicate: IterFn<T>): boolean {
  let i = 0;
  for (const item of iter) {
    if (predicate(item, i++)) {
      return true;
    }
  }
  return false;
}
