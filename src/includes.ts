/**
 * Checks if an iterable includes a specific value using Object.is equality
 */
export function includes<T>(iter: Iterable<T>, value: T): boolean;
export function includes<T>(value: T): (iter: Iterable<T>) => boolean;
export function includes<T>(
  iterOrValue: Iterable<T> | T,
  maybeValue?: T
): boolean | ((iter: Iterable<T>) => boolean) {
  // Check if first argument is iterable
  if (
    iterOrValue != null &&
    typeof (iterOrValue as any)[Symbol.iterator] === "function" &&
    arguments.length === 2
  ) {
    // Direct form: includes(iterable, value)
    return _includes(iterOrValue as Iterable<T>, maybeValue as T);
  }

  // Curried form: includes(value)
  return (iter: Iterable<T>) => _includes(iter, iterOrValue as T);
}

function _includes<T>(iter: Iterable<T>, value: T): boolean {
  for (const item of iter) {
    if (Object.is(item, value)) return true;
  }
  return false;
}
