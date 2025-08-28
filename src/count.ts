export function count<T>(iter: Iterable<T>) {
  let i = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _item of iter) i++;
  return i;
}
