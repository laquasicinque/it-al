export function* enumerate<T>(
  iter: Iterable<T>
): IterableIterator<[number, T]> {
  let i = 0;
  for (const item of iter) {
    yield [i++, item];
  }
}
