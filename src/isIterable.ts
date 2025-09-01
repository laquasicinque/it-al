/**
 * Checks if the given item is an iterable
 */
export const isIterable = <T = unknown>(x: unknown): x is Iterable<T> =>
  /// @ts-ignore optional chaining makes this safe
  typeof x?.[Symbol.iterator] === "function";

export const isNonStringIterable = <T = unknown>(
  x: unknown
): x is Iterable<T> => isIterable(x) && typeof x !== "string";
