import type { MaybePromise } from "./_types";
import { gen } from "./gen";
import { isAsyncIterable } from "./isAsyncIterable";
import { Iter } from "./Iter";
import { type Peekable, peekable } from "./peekable";
import { range } from "./range";
import { search, type KeyValuePair } from "./search";
import { zip } from "./zip";

export const peekableIterMixin = (BaseIter: typeof Iter<unknown>) => {
  /**
   *  PeekableIter is identical to an iterable but allows for the peek
   *  method. However, because of this, it's a little bit less efficient
   *  than a regular Iter, and so is separate from it.
   */
  /// @ts-expect-error The typing of search is correct but causes issues
  return class PeekableIter<T> extends BaseIter {
    readonly #peekable: Peekable<T>;

    constructor(iter: Iterable<T>) {
      const wrapped = peekable(iter);
      super(wrapped);
      this.#peekable = wrapped;
    }

    static override from<T>(iterable: Iterable<T>): PeekableIter<T> {
      return new PeekableIter(iterable);
    }

    static override fromEntries(
      obj: Partial<Record<PropertyKey, unknown>>
    ): PeekableIter<[string, unknown]> {
      return new PeekableIter(Object.entries(obj));
    }

    static override async fromAsync<T>(
      iterable: Iterable<MaybePromise<T>> | AsyncIterable<T>
    ): Promise<PeekableIter<Awaited<T>>> {
      if (isAsyncIterable(iterable)) {
        const arr: Awaited<T>[] = [];
        for await (const item of iterable) {
          arr.push(item);
        }
        return new PeekableIter(arr);
      }
      return new PeekableIter(await Promise.all(iterable));
    }

    static override fromRange(
      stop: number,
      start?: number,
      stepSize?: number
    ): PeekableIter<number> {
      return new PeekableIter(range(stop, start, stepSize));
    }

    static override gen<T>(fn: (index: number) => T) {
      return new PeekableIter(gen(fn)());
    }

    static override zip<const I extends Iterable<unknown>[]>(
      iter: I,
      stopOnMin?: boolean
    ) {
      return new PeekableIter(zip(iter, stopOnMin));
    }

    static override search<U>(
      obj: unknown,
      fn: (path: PropertyKey[], value: any) => unknown,
      skipAfterYield?: boolean
    ): PeekableIter<KeyValuePair<U>> {
      return new PeekableIter(search(obj, fn, skipAfterYield));
    }

    peek() {
      return this.#peekable.peek();
    }

    override peekable() {
      // peekable on a PeakableIter returns itself as there's no benefit in wrapping the value again
      return this;
    }

    [Symbol.iterator](): Iterator<T> {
      return this.#peekable[Symbol.iterator]();
    }
  };
};
