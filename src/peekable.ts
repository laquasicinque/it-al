import type { Prettify } from "./_types";

export type Peekable<T> = Prettify<
  {
    peek(): T;
  } & Iterable<T>
>;

export function peekable<T>(iter: Iterable<T>) {
  const it = iter[Symbol.iterator]();
  let peekValue = undefined as IteratorResult<T> | undefined;

  return {
    peek() {
      if (peekValue && "value" in peekValue) return peekValue.value;
      peekValue = it.next();
      return peekValue.value;
    },
    [Symbol.iterator]: function* () {
      let lastValue: IteratorResult<T>;
      /// @ts-expect-error
      while (!lastValue?.done) {
        if (peekValue && "value" in peekValue) {
          if (peekValue.done) return peekValue.value;
          lastValue = peekValue;
          peekValue = undefined;
          yield lastValue.value;
        }
        lastValue = it.next();
        if (lastValue.done) return lastValue.value;
        yield lastValue.value;
      }
    },
  };
}
