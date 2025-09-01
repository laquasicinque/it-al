/**
 * Checks if the given item is an async iterable
 */
export const isAsyncIterable = <T = unknown>(
  x: unknown
): x is AsyncIterable<T> =>
  /// @ts-ignore optional chaining makes this safe
  typeof x?.[Symbol.asyncIterator] === "function";
