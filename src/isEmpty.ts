export function isEmpty(iter: Iterable<unknown>): boolean {
  return !!iter[Symbol.iterator]().next().done;
}
