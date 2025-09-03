import { average } from "./average";
import { chunk } from "./chunk";
import { count } from "./count";
import { entries } from "./entries";
import { enumerate } from "./enumerate";
import { every } from "./every";
import { filter } from "./filter";
import { find } from "./find";
import { findIndex } from "./findIndex";
import { first } from "./first";
import { flat, type FlatItem } from "./flat";
import { gen } from "./gen";
import { includes } from "./includes";
import { isEmpty } from "./isEmpty";
import { join } from "./join";
import { groupBy } from "./groupBy";
import { last } from "./last";
import { map } from "./map";
import { partition } from "./partition";
import { pluck } from "./pluck";
import { product } from "./product";
import { range } from "./range";
import { reduce } from "./reduce";
import { repeat } from "./repeat";
import { scan } from "./scan";
import { cycle } from "./cycle";
import { search, type KeyValuePair } from "./search";
import { skip } from "./skip";
import { skipWhile } from "./skipWhile";
import { some } from "./some";
import { sum } from "./sum";
import { take } from "./take";
import { takeWhile } from "./takeWhile";
import { tap } from "./tap";
import { uniqueBy } from "./uniqueBy";
import { until } from "./until";
import { unzip, type UnzipOutput } from "./unzip";
import { windows } from "./windows";
import { zip } from "./zip";
import type {
  IterFn,
  MaybePromise,
  PeekableIter as PeekableIterType,
} from "./_types";
import { isAsyncIterable } from "./isAsyncIterable";
import { PeekableIter } from "./index";

const _collectAsArray = <T>([...x]: Iterable<T>): T[] => x;

/**
 * Class version of the iterable functions. Wraps iterable results in itself
 * other than collect and toArray
 */
export class Iter<T> implements Iterable<T> {
  readonly #value: Iterable<T>;

  static from<T>(iterable: Iterable<T>) {
    return new Iter<T>(iterable);
  }

  static async fromAsync<T>(
    iterable: Iterable<MaybePromise<T>> | AsyncIterable<T>
  ): Promise<Iter<Awaited<T>>> {
    if (isAsyncIterable(iterable)) {
      const arr: Awaited<T>[] = [];
      for await (const item of iterable) {
        arr.push(item);
      }
      return new Iter(arr);
    }
    return new Iter(await Promise.all(iterable));
  }

  static fromEntries(obj: Partial<Record<PropertyKey, unknown>>) {
    return new Iter(entries(obj));
  }

  static fromRange(stop: number, start?: number, stepSize?: number) {
    return new Iter(range(stop, start, stepSize));
  }

  static gen<T>(fn: (index: number) => T) {
    return new Iter(gen(fn)());
  }

  static zip<const I extends Iterable<unknown>[]>(
    iter: I,
    stopOnMin?: boolean
  ) {
    return new Iter(zip(iter, stopOnMin));
  }

  static search<U>(
    obj: unknown,
    fn: (path: PropertyKey[], value: any) => unknown,
    skipAfterYield?: boolean
  ): Iter<KeyValuePair<U>> {
    return new Iter(search(obj, fn, skipAfterYield));
  }

  constructor(iterable: Iterable<T>) {
    this.#value = iterable;
  }

  flatMap<U>(fn: IterFn<T, U>) {
    return this.map(fn).flat(1);
  }

  flat<Depth extends number = 1>(depth?: Depth) {
    return new Iter(flat(this.#value as any, depth ?? 1)) as Iter<
      FlatItem<T, Depth>
    >;
  }

  map<U>(fn: IterFn<T, U>) {
    return new Iter(map(this.#value, fn));
  }

  filter(fn: IterFn<T>) {
    return new Iter(filter(this.#value, fn));
  }

  filterNullish(): Iter<NonNullable<T>> {
    return this.filter(x => x != null) as Iter<NonNullable<T>>;
  }

  unique() {
    return new Iter(new Set(this.#value));
  }

  enumerate(): Iter<[number, T]> {
    return new Iter(enumerate(this.#value));
  }

  uniqueBy(fn: IterFn<T>): Iter<T> {
    return new Iter(uniqueBy(this.#value, fn));
  }

  tap(fn: IterFn<T>): Iter<T> {
    return new Iter(tap(this.#value, fn));
  }

  scan<U>(
    ...args: [fn: (acc: U, item: T, index: number) => U, start?: U]
  ): Iter<U> {
    const [fn, start] = args;
    return args.length === 2
      ? new Iter(scan(this.#value, fn))
      : new Iter(scan(this.#value, fn, start));
  }

  pluck<K extends keyof T>(key: K): Iter<T[K]> {
    return new Iter(pluck(this.#value, key));
  }

  take(count: number) {
    return new Iter(take(this.#value, count));
  }

  chunk(count: number) {
    return new Iter(chunk(this.#value, count));
  }

  skip(count: number) {
    return new Iter(skip(this.#value, count));
  }

  takeWhile(fn: IterFn<T>) {
    return new Iter(takeWhile(this.#value, fn));
  }

  skipWhile(fn: IterFn<T>) {
    return new Iter(skipWhile(this.#value, fn));
  }

  until(fn: IterFn<T>) {
    return new Iter(until(this.#value, fn));
  }

  windows(size: number) {
    return new Iter(windows(this.#value, size));
  }

  apply<Output>(fn: (item: Iterable<T>) => Iterable<Output>) {
    return new Iter(fn(this.#value));
  }

  // methods that won't necessarily return Iter instances
  first() {
    return first(this.#value);
  }

  last() {
    return last(this.#value);
  }

  find(fn: IterFn<T>): T | null {
    return find(this.#value, fn);
  }

  findIndex(fn: IterFn<T>): number | null {
    return findIndex(this.#value, fn);
  }

  includes(needle: T): boolean {
    return includes(this.#value, needle);
  }

  count(): number {
    return count(this.#value);
  }

  isEmpty(): boolean {
    return isEmpty(this.#value);
  }

  reduce<U>(fn: (acc: U, item: T, index: number) => U, start: U): U {
    return reduce(this.#value, fn, start);
  }

  every(fn: IterFn<T>) {
    return every(this.#value, fn);
  }

  some(fn: IterFn<T>) {
    return some(this.#value, fn);
  }

  unzip<
    Output = [T] extends [readonly unknown[]] ? UnzipOutput<T> : never,
  >(): Output {
    return unzip(this.#value as Iterable<readonly unknown[]>) as Output;
  }

  partition<Result extends T = T>(
    predicate: (item: T, index: number) => item is Result
  ): [passed: T[], failed: T[]];
  partition(predicate: IterFn<T>): [passed: T[], failed: T[]];
  partition(predicate: IterFn<T>) {
    return partition(this.#value, predicate);
  }

  join(delimiter = ",") {
    return join(this.#value, delimiter);
  }

  groupBy<U>(fnOrKey: IterFn<T, U> | keyof T) {
    return groupBy(this.#value, fnOrKey);
  }

  groupByIter<U>(fn: IterFn<T, U>) {
    return new Iter(groupBy(this.#value, fn));
  }

  peekable(): PeekableIterType<T> {
    return new PeekableIter(this.#value);
  }

  // Mathematical operations

  sum<Output = [T] extends [number] ? number : never>(): Output {
    return sum(this.#value as unknown as Iterable<number>) as Output;
  }

  product<Output = [T] extends [number] ? number : never>(): Output {
    return product(this.#value as unknown as Iterable<number>) as Output;
  }

  average<Output = [T] extends [number] ? number : never>(): Output {
    return average(this.#value as unknown as Iterable<number>) as Output;
  }

  min<Output = [T] extends [number] ? number : never>(): Output {
    return Math.min(...(this.#value as unknown as Iterable<number>)) as Output;
  }

  max<Output = [T] extends [number] ? number : never>(): Output {
    return Math.max(...(this.#value as unknown as Iterable<number>)) as Output;
  }

  // "exporting" operations

  collect<Output = T[]>(collector?: (x: Iterable<T>) => Output): Output {
    return collector
      ? collector(this.#value)
      : (_collectAsArray<T>(this.#value) as Output);
  }

  repeat(times: number): Iter<T> {
    return new Iter(repeat(this.#value, times));
  }

  cycle(): Iter<T> {
    return new Iter(cycle(this.#value));
  }

  toArray() {
    return this.collect();
  }

  toSet() {
    return this.collect(x => new Set(x));
  }

  toMap(): T extends readonly [infer A, infer B] ? Map<A, B> : never {
    return this.collect(
      x => new Map(x as Iterable<[unknown, unknown]>)
    ) as T extends readonly [infer A, infer B] ? Map<A, B> : never;
  }

  [Symbol.iterator](): Iterator<T> {
    return this.#value[Symbol.iterator]();
  }
}
