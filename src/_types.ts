import type { Iter } from "./Iter";
import type { Peekable } from "./peekable";
import type { KeyValuePair } from "./search";
import type { ZipOutput } from "./zip";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type MaybePromise<T> = T | Promise<T>;

export type IterFn<T, U = unknown> = (iter: T, index: number) => U;

export type CurriedFn<T, U> = (iter: Iterable<T>) => U;
export type TupleOf<
  Value,
  Length extends number,
  Result extends readonly Value[] = [],
> = Result["length"] extends Length
  ? Result
  : TupleOf<Value, Length, [...Result, Value]>;

export type TupleFirst<Tuple extends readonly unknown[]> =
  Tuple extends Readonly<[infer Head, ...(readonly unknown[])]> ? Head : never;

export type TupleExcludingFirst<Tuple extends readonly unknown[]> =
  Tuple extends Readonly<[unknown, ...infer Tail]> ? Tail : never;

export type TupleLast<Tuple extends readonly unknown[]> =
  Tuple extends Readonly<[...unknown[], infer Last]> ? Last : never;

export type TupleExcludingLast<Tuple extends readonly unknown[]> =
  Tuple extends Readonly<[...infer Rest, unknown]> ? Rest : never;

/// @ts-expect-error
export declare class PeekableIter<T> extends Iter<T> {
  constructor(iter: Iterable<T>);

  static override from<T>(iterable: Iterable<T>): PeekableIter<T>;

  static override fromEntries(
    obj: Partial<Record<PropertyKey, unknown>>
  ): PeekableIter<[string, unknown]>;

  static override fromAsync<T>(
    iterable: Iterable<MaybePromise<T>> | AsyncIterable<T>
  ): Promise<PeekableIter<Awaited<T>>>;

  static override fromRange(
    stop: number,
    start?: number,
    stepSize?: number
  ): PeekableIter<number>;

  static override gen<T>(fn: (index: number) => T): PeekableIter<T>;

  static override zip<const I extends Iterable<unknown>[]>(
    iter: I,
    stopOnMin?: boolean
  ): PeekableIter<ZipOutput<I>>;

  static override search<U>(
    obj: unknown,
    fn: (path: PropertyKey[], value: any) => unknown,
    skipAfterYield?: boolean
  ): PeekableIter<KeyValuePair<U>>;

  peek(): T;

  override peekable(): this;

  [Symbol.iterator](): Iterator<T>;
}
