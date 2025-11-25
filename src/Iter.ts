import { average } from "./average";
import { chunk } from "./chunk";
import { count } from "./count";
import { entries, type Entry } from "./entries";
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
import { zip, type RecursiveZipOutput } from "./zip";
import type {
  IterFn,
  MaybePromise,
  PeekableIter as PeekableIterType,
} from "./_types";
import { isAsyncIterable } from "./isAsyncIterable";
import { isIterable, PeekableIter } from "./index";

const _collectAsArray = <T>([...x]: Iterable<T>): T[] => x;

type SafeEntriesOutput<T> =
  T extends Record<PropertyKey, unknown>
    ? Iter<Entry<T>>
    : T extends Iterable<[infer K, infer V]>
      ? Iter<[K, V]>
      : T extends Record<"entries", () => Iterable<[infer K, infer V]>>
        ? Iter<[K, V]>
        : Iter<never>;

/**
 * Class version of the iterable functions. Wraps iterable results in itself
 * other than collect and toArray
 */
export class Iter<T> implements Iterable<T> {
  readonly #value: Iterable<T>;

  /**
   * Creates an Iter from any iterable.
   * @param iterable - Any iterable to wrap
   * @returns A new Iter instance
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3, 4, 5]);
   * const doubled = iter.map(x => x * 2).toArray();
   * // [2, 4, 6, 8, 10]
   * ```
   */
  static from<T>(iterable: Iterable<T>) {
    return new Iter<T>(iterable);
  }

  /**
   * Creates an iter from an unknown input. If the input is an iterable, then it is equivalent to Iter.from
   * If it is not, then it returns an empty Iter instead.
   * @returns A new Iter instance
   * @example
   * ```ts
   * const iter = Iter.from(foo?.bar?.baz) // could error if input is null
   * const safeIter = Iter.safeFrom(foo?.bar?.baz) //
   * ```
   */
  static safeFrom<T>(
    maybeIterable?: T
  ): T extends Iterable<infer U> ? Iter<U> : Iter<never> {
    if (isIterable(maybeIterable))
      return new Iter(maybeIterable) as T extends Iterable<infer U>
        ? Iter<U>
        : Iter<never>;

    return new Iter([]) as T extends Iterable<infer U> ? Iter<U> : Iter<never>;
  }

  /**
   * Creates an Iter from an async iterable or iterable of promises.
   * @param iterable - An async iterable or iterable of promises
   * @returns A Promise that resolves to an Iter instance
   * @example
   * ```ts
   * const promises = [Promise.resolve(1), Promise.resolve(2)];
   * const iter = await Iter.fromAsync(promises);
   * iter.toArray(); // [1, 2]
   * ```
   */
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

  /**
   * Creates an Iter from object entries.
   * @param obj - An object to get entries from
   * @returns An Iter of key-value pairs
   * @example
   * ```ts
   * const iter = Iter.fromEntries({ a: 1, b: 2, c: 3 });
   * iter.toArray(); // [['a', 1], ['b', 2], ['c', 3]]
   * ```
   */
  static fromEntries(obj: Partial<Record<PropertyKey, unknown>>) {
    return new Iter(entries(obj));
  }

  /**
   * Creates an Iter from object entries.
   * @param obj - An object to get entries from
   * @returns An Iter of key-value pairs
   * @example
   * ```ts
   * const iter = Iter.fromEntries({ a: 1, b: 2, c: 3 });
   * iter.toArray(); // [['a', 1], ['b', 2], ['c', 3]]
   * ```
   */
  static safeFromEntries<T>(obj?: T): SafeEntriesOutput<T> {
    if (obj == null) return new Iter([]) as SafeEntriesOutput<T>;
    if (typeof obj === "object")
      return new Iter(entries(obj)) as SafeEntriesOutput<T>;
    return new Iter([]) as SafeEntriesOutput<T>;
  }

  /**
   * Creates an Iter from a numeric range.
   * @param stop - The end of the range (exclusive)
   * @param start - The start of the range (default: 0)
   * @param stepSize - The step size (default: 1)
   * @returns An Iter of numbers in the range
   * @example
   * ```ts
   * Iter.fromRange(5).toArray(); // [0, 1, 2, 3, 4]
   * Iter.fromRange(10, 5).toArray(); // [5, 6, 7, 8, 9]
   * Iter.fromRange(10, 0, 2).toArray(); // [0, 2, 4, 6, 8]
   * ```
   */
  static fromRange(stop: number, start?: number, stepSize?: number) {
    return new Iter(range(stop, start, stepSize));
  }

  /**
   * Creates an infinite Iter using a generator function.
   * @param fn - A function that takes an index and returns a value
   * @returns An infinite Iter
   * @example
   * ```ts
   * const squares = Iter.gen(n => n * n);
   * squares.take(5).toArray(); // [0, 1, 4, 9, 16]
   * ```
   */
  static gen<T>(fn: (index: number) => T) {
    return new Iter(gen(fn)());
  }

  /**
   * Zips multiple iterables together into tuples.
   * @param iter - An array of iterables to zip
   * @param stopOnMin - Whether to stop when the shortest iterable is exhausted (default: true)
   * @returns An Iter of tuples
   * @example
   * ```ts
   * const zipped = Iter.zip([[1, 2, 3], ['a', 'b', 'c']]);
   * zipped.toArray(); // [[1, 'a'], [2, 'b'], [3, 'c']]
   * ```
   */
  static zip<const I extends Iterable<unknown>[]>(
    iter: I,
    stopOnMin?: boolean
  ): Iter<RecursiveZipOutput<I>> {
    return new Iter(zip(iter, stopOnMin));
  }

  /**
   * Recursively searches an object for values matching a predicate.
   * @param obj - The object to search
   * @param fn - A predicate function that receives the path and value
   * @param skipAfterYield - Whether to skip children after yielding a match
   * @returns An Iter of key-value pairs
   * @example
   * ```ts
   * const obj = { a: { b: { c: 1 } }, d: 2 };
   * const found = Iter.search(obj, (path, val) => typeof val === 'number');
   * found.toArray(); // [[['a', 'b', 'c'], 1], [['d'], 2]]
   * ```
   */
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

  /**
   * Maps and then flattens the result by one level.
   * @param fn - A function to map each item
   * @returns A new Iter with mapped and flattened items
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3]);
   * iter.flatMap(x => [x, x * 2]).toArray();
   * // [1, 2, 2, 4, 3, 6]
   * ```
   */
  flatMap<U>(fn: IterFn<T, U>) {
    return this.map(fn).flat(1);
  }

  /**
   * Flattens nested iterables by the specified depth.
   * @param depth - The depth to flatten (default: 1)
   * @returns A new Iter with flattened items
   * @example
   * ```ts
   * const iter = Iter.from([[1, 2], [3, [4, 5]]]);
   * iter.flat(1).toArray(); // [1, 2, 3, [4, 5]]
   * iter.flat(2).toArray(); // [1, 2, 3, 4, 5]
   * ```
   */
  flat<Depth extends number = 1>(depth?: Depth) {
    return new Iter(flat(this.#value as any, depth ?? 1)) as Iter<
      FlatItem<T, Depth>
    >;
  }

  /**
   * Transforms each item using a mapping function.
   * @param fn - A function to transform each item
   * @returns A new Iter with transformed items
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3]);
   * iter.map(x => x * 2).toArray(); // [2, 4, 6]
   * ```
   */
  map<U>(fn: IterFn<T, U>) {
    return new Iter(map(this.#value, fn));
  }

  /**
   * Filters items based on a predicate function.
   * @param fn - A predicate function
   * @returns A new Iter with filtered items
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3, 4, 5]);
   * iter.filter(x => x % 2 === 0).toArray(); // [2, 4]
   * ```
   */
  filter(fn: IterFn<T>) {
    return new Iter(filter(this.#value, fn));
  }

  /**
   * Removes null and undefined values from the iterable.
   * @returns A new Iter with non-nullish items
   * @example
   * ```ts
   * const iter = Iter.from([1, null, 2, undefined, 3]);
   * iter.filterNullish().toArray(); // [1, 2, 3]
   * ```
   */
  filterNullish(): Iter<NonNullable<T>> {
    return this.filter(x => x != null) as Iter<NonNullable<T>>;
  }

  /**
   * Returns unique values from the iterable.
   * @returns A new Iter with unique items
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 2, 3, 3, 3]);
   * iter.unique().toArray(); // [1, 2, 3]
   * ```
   */
  unique() {
    // while we could just new return new Iter(new Set(this.#value))
    // that would consume the entire iterable immediately, which would be very
    // bad for infinite iterables. This does come at the cost of performance though.
    return this.uniqueBy(x => x);
  }

  /**
   * Adds an index to each item as a tuple [index, value].
   * @returns A new Iter of index-value pairs
   * @example
   * ```ts
   * const iter = Iter.from(['a', 'b', 'c']);
   * iter.enumerate().toArray(); // [[0, 'a'], [1, 'b'], [2, 'c']]
   * ```
   */
  enumerate(): Iter<[number, T]> {
    return new Iter(enumerate(this.#value));
  }

  /**
   * Returns unique items based on a selector function.
   * @param fn - A function to select the value to compare for uniqueness
   * @returns A new Iter with unique items
   * @example
   * ```ts
   * const iter = Iter.from([{ id: 1 }, { id: 2 }, { id: 1 }]);
   * iter.uniqueBy(x => x.id).toArray(); // [{ id: 1 }, { id: 2 }]
   * ```
   */
  uniqueBy(fn: IterFn<T>): Iter<T> {
    return new Iter(uniqueBy(this.#value, fn));
  }

  /**
   * Runs a side effect function on each item without modifying the iterable.
   * @param fn - A function to run for side effects
   * @returns A new Iter with the same items
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3]);
   * iter.tap(x => console.log(x)).map(x => x * 2).toArray();
   * // Logs: 1, 2, 3
   * // Returns: [2, 4, 6]
   * ```
   */
  tap(fn: IterFn<T>): Iter<T> {
    return new Iter(tap(this.#value, fn));
  }

  /**
   * Like reduce, but yields intermediate accumulator values.
   * @param args - The reducer function and optional starting value
   * @returns A new Iter of intermediate values
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3, 4]);
   * iter.scan((acc, x) => acc + x, 0).toArray();
   * // [1, 3, 6, 10]
   * ```
   */
  scan<U>(
    ...args: [fn: (acc: U, item: T, index: number) => U, start?: U]
  ): Iter<U> {
    const [fn, start] = args;
    return args.length === 2
      ? new Iter(scan(this.#value, fn))
      : new Iter(scan(this.#value, fn, start));
  }

  /**
   * Extracts a property value from each item.
   * @param key - The property key to extract
   * @returns A new Iter of property values
   * @example
   * ```ts
   * const iter = Iter.from([{ name: 'Alice' }, { name: 'Bob' }]);
   * iter.pluck('name').toArray(); // ['Alice', 'Bob']
   * ```
   */
  pluck<K extends keyof T>(key: K): Iter<T[K]> {
    return new Iter(pluck(this.#value, key));
  }

  /**
   * Takes the first n items from the iterable.
   * @param count - The number of items to take
   * @returns A new Iter with the first n items
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3, 4, 5]);
   * iter.take(3).toArray(); // [1, 2, 3]
   * ```
   */
  take(count: number) {
    return new Iter(take(this.#value, count));
  }

  /**
   * Splits the iterable into chunks of the specified size.
   * @param count - The size of each chunk
   * @returns A new Iter of arrays (chunks)
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3, 4, 5]);
   * iter.chunk(2).toArray(); // [[1, 2], [3, 4], [5]]
   * ```
   */
  chunk(count: number) {
    return new Iter(chunk(this.#value, count));
  }

  /**
   * Skips the first n items from the iterable.
   * @param count - The number of items to skip
   * @returns A new Iter without the first n items
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3, 4, 5]);
   * iter.skip(2).toArray(); // [3, 4, 5]
   * ```
   */
  skip(count: number) {
    return new Iter(skip(this.#value, count));
  }

  /**
   * Takes items while a predicate is true, then stops.
   * @param fn - A predicate function
   * @returns A new Iter with items taken while predicate is true
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3, 4, 5]);
   * iter.takeWhile(x => x < 4).toArray(); // [1, 2, 3]
   * ```
   */
  takeWhile(fn: IterFn<T>) {
    return new Iter(takeWhile(this.#value, fn));
  }

  /**
   * Skips items while a predicate is true, then yields the rest.
   * @param fn - A predicate function
   * @returns A new Iter with items after predicate becomes false
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3, 4, 5]);
   * iter.skipWhile(x => x < 3).toArray(); // [3, 4, 5]
   * ```
   */
  skipWhile(fn: IterFn<T>) {
    return new Iter(skipWhile(this.#value, fn));
  }

  /**
   * Takes items until a predicate is true, then stops.
   * @param fn - A predicate function
   * @returns A new Iter with items until predicate is true
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3, 4, 5]);
   * iter.until(x => x === 3).toArray(); // [1, 2]
   * ```
   */
  until(fn: IterFn<T>) {
    return new Iter(until(this.#value, fn));
  }

  /**
   * Creates sliding windows of the specified size.
   * @param size - The size of each window
   * @returns A new Iter of arrays (windows)
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3, 4, 5]);
   * iter.windows(3).toArray();
   * // [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
   * ```
   */
  windows(size: number) {
    return new Iter(windows(this.#value, size));
  }

  /**
   * Applies a custom function to the iterable.
   * @param fn - A function that takes an iterable and returns an iterable
   * @returns A new Iter with the function applied
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3]);
   * iter.apply(it => filter(it, x => x > 1)).toArray(); // [2, 3]
   * ```
   */
  apply<Output>(fn: (item: Iterable<T>) => Iterable<Output>) {
    return new Iter(fn(this.#value));
  }

  // methods that won't necessarily return Iter instances

  /**
   * Gets the first item from the iterable.
   * @returns The first item
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3]);
   * iter.first(); // 1
   * ```
   */
  first() {
    return first(this.#value);
  }

  /**
   * Gets the last item from the iterable.
   * @returns The last item, or undefined if empty
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3]);
   * iter.last(); // 3
   * ```
   */
  last() {
    return last(this.#value);
  }

  /**
   * Finds the first item matching a predicate.
   * @param fn - A predicate function
   * @returns The first matching item, or null if not found
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3, 4, 5]);
   * iter.find(x => x > 3); // 4
   * ```
   */
  find(fn: IterFn<T>): T | null {
    return find(this.#value, fn);
  }

  /**
   * Finds the index of the first item matching a predicate.
   * @param fn - A predicate function
   * @returns The index of the first match, or null if not found
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3, 4, 5]);
   * iter.findIndex(x => x > 3); // 3
   * ```
   */
  findIndex(fn: IterFn<T>): number | null {
    return findIndex(this.#value, fn);
  }

  /**
   * Checks if the iterable includes a specific value (using Object.is equality).
   * @param needle - The value to search for
   * @returns True if the value is found
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3]);
   * iter.includes(2); // true
   * iter.includes(5); // false
   * ```
   */
  includes(needle: T): boolean {
    return includes(this.#value, needle);
  }

  /**
   * Counts the total number of items in the iterable.
   * @returns The count of items
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3, 4, 5]);
   * iter.count(); // 5
   * ```
   */
  count(): number {
    return count(this.#value);
  }

  /**
   * Checks if the iterable is empty.
   * @returns True if empty
   * @example
   * ```ts
   * Iter.from([]).isEmpty(); // true
   * Iter.from([1]).isEmpty(); // false
   * ```
   */
  isEmpty(): boolean {
    return isEmpty(this.#value);
  }

  /**
   * Like Array.forEach but for Iter
   * @param fn - A function to run on each item in the Iter
   * @example
   * ```ts
   * const iter = Iter.from([1,2,3,4]).forEach(console.log) // prints 1, 2, 3, 4
   * iter // undefined
   * ```
   */
  forEach(fn: (item: T, index: number) => void): void {
    let i = 0;
    for (const item of this) {
      fn(item, i++);
    }
  }

  /**
   * Reduces the iterable to a single value using an accumulator function.
   * @param fn - The reducer function
   * @param start - The initial accumulator value
   * @returns The final accumulated value
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3, 4]);
   * iter.reduce((acc, x) => acc + x, 0); // 10
   * ```
   */
  reduce<U>(fn: (acc: U, item: T, index: number) => U, start: U): U {
    return reduce(this.#value, fn, start);
  }

  /**
   * Tests whether all items match a predicate.
   * @param fn - A predicate function
   * @returns True if all items match
   * @example
   * ```ts
   * const iter = Iter.from([2, 4, 6]);
   * iter.every(x => x % 2 === 0); // true
   * ```
   */
  every(fn: IterFn<T>) {
    return every(this.#value, fn);
  }

  /**
   * Tests whether any item matches a predicate.
   * @param fn - A predicate function
   * @returns True if any item matches
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3]);
   * iter.some(x => x > 2); // true
   * ```
   */
  some(fn: IterFn<T>) {
    return some(this.#value, fn);
  }

  /**
   * Transposes an iterable of arrays (opposite of zip).
   * @returns The transposed output
   * @example
   * ```ts
   * const iter = Iter.from([[1, 'a'], [2, 'b'], [3, 'c']]);
   * iter.unzip(); // [[1, 2, 3], ['a', 'b', 'c']]
   * ```
   */
  unzip<
    Output = [T] extends [readonly unknown[]] ? UnzipOutput<T> : never,
  >(): Output {
    return unzip(this.#value as Iterable<readonly unknown[]>) as Output;
  }

  /**
   * Splits items into two arrays based on a predicate.
   * @param predicate - A predicate function
   * @returns A tuple of [passed, failed] arrays
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3, 4, 5]);
   * iter.partition(x => x % 2 === 0);
   * // [[2, 4], [1, 3, 5]]
   * ```
   */
  partition<Result extends T = T>(
    predicate: (item: T, index: number) => item is Result
  ): [passed: T[], failed: T[]];
  partition(predicate: IterFn<T>): [passed: T[], failed: T[]];
  partition(predicate: IterFn<T>) {
    return partition(this.#value, predicate);
  }

  /**
   * Joins all items into a string with a delimiter.
   * @param delimiter - The delimiter to use (default: ",")
   * @returns The joined string
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3]);
   * iter.join('-'); // "1-2-3"
   * ```
   */
  join(delimiter = ",") {
    return join(this.#value, delimiter);
  }

  /**
   * Groups items by a key selector function or property name.
   * @param fnOrKey - A selector function or property key
   * @returns A Map of grouped items
   * @example
   * ```ts
   * const iter = Iter.from([{type: 'a', val: 1}, {type: 'b', val: 2}, {type: 'a', val: 3}]);
   * iter.groupBy('type');
   * // Map { 'a' => [{type: 'a', val: 1}, {type: 'a', val: 3}], 'b' => [{type: 'b', val: 2}] }
   * ```
   */
  groupBy<U>(fnOrKey: IterFn<T, U> | keyof T) {
    return groupBy(this.#value, fnOrKey);
  }

  /**
   * Groups items and returns an Iter of the Map.
   * @param fn - A selector function
   * @returns An Iter of the grouped Map
   * @example
   * ```ts
   * const iter = Iter.from([{type: 'a'}, {type: 'b'}]);
   * iter.groupByIter(x => x.type); // Iter<Map<...>>
   * ```
   */
  groupByIter<U>(fn: IterFn<T, U>) {
    return new Iter(groupBy(this.#value, fn));
  }

  /**
   * Converts to a PeekableIter that allows peeking at the next value.
   * @returns A PeekableIter instance
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3]).peekable();
   * iter.peek(); // 1
   * iter.first(); // 1
   * ```
   */
  peekable(): PeekableIterType<T> {
    return new PeekableIter(this.#value);
  }

  // Mathematical operations

  /**
   * Sums all numbers in the iterable.
   * @returns The sum of all numbers
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3, 4, 5]);
   * iter.sum(); // 15
   * ```
   */
  sum<Output = [T] extends [number] ? number : never>(): Output {
    return sum(this.#value as unknown as Iterable<number>) as Output;
  }

  /**
   * Multiplies all numbers in the iterable together.
   * @returns The product of all numbers
   * @example
   * ```ts
   * const iter = Iter.from([2, 3, 4]);
   * iter.product(); // 24
   * ```
   */
  product<Output = [T] extends [number] ? number : never>(): Output {
    return product(this.#value as unknown as Iterable<number>) as Output;
  }

  /**
   * Calculates the average of all numbers in the iterable.
   * @returns The average of all numbers
   * @example
   * ```ts
   * const iter = Iter.from([10, 20, 30]);
   * iter.average(); // 20
   * ```
   */
  average<Output = [T] extends [number] ? number : never>(): Output {
    return average(this.#value as unknown as Iterable<number>) as Output;
  }

  /**
   * Finds the minimum value in the iterable.
   * @returns The minimum number
   * @example
   * ```ts
   * const iter = Iter.from([5, 2, 8, 1, 9]);
   * iter.min(); // 1
   * ```
   */
  min<Output = [T] extends [number] ? number : never>(): Output {
    return Math.min(...(this.#value as unknown as Iterable<number>)) as Output;
  }

  /**
   * Finds the maximum value in the iterable.
   * @returns The maximum number
   * @example
   * ```ts
   * const iter = Iter.from([5, 2, 8, 1, 9]);
   * iter.max(); // 9
   * ```
   */
  max<Output = [T] extends [number] ? number : never>(): Output {
    return Math.max(...(this.#value as unknown as Iterable<number>)) as Output;
  }

  // "exporting" operations

  /**
   * Collects the iterable using a custom collector function.
   * @param collector - Optional collector function (defaults to toArray)
   * @returns The collected result
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3]);
   * iter.collect(); // [1, 2, 3]
   * iter.collect(it => new Set(it)); // Set { 1, 2, 3 }
   * ```
   */
  collect<Output = T[]>(collector?: (x: Iterable<T>) => Output): Output {
    return collector
      ? collector(this.#value)
      : (_collectAsArray<T>(this.#value) as Output);
  }

  /**
   * Repeats the iterable a specified number of times.
   * @param times - The number of times to repeat
   * @returns A new Iter with repeated items
   * @example
   * ```ts
   * const iter = Iter.from([1, 2]);
   * iter.repeat(3).toArray(); // [1, 2, 1, 2, 1, 2]
   * ```
   */
  repeat(times: number): Iter<T> {
    return new Iter(repeat(this.#value, times));
  }

  /**
   * Creates an infinite iterator that cycles through the items.
   * @returns A new Iter that cycles infinitely
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3]);
   * iter.cycle().take(7).toArray(); // [1, 2, 3, 1, 2, 3, 1]
   * ```
   */
  cycle(): Iter<T> {
    return new Iter(cycle(this.#value));
  }

  /**
   * Collects all items into an array.
   * @returns An array of all items
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 3]);
   * iter.map(x => x * 2).toArray(); // [2, 4, 6]
   * ```
   */
  toArray() {
    return this.collect();
  }

  /**
   * Collects all items into a Set.
   * @returns A Set of all unique items
   * @example
   * ```ts
   * const iter = Iter.from([1, 2, 2, 3, 3, 3]);
   * iter.toSet(); // Set { 1, 2, 3 }
   * ```
   */
  toSet() {
    return this.collect(x => new Set(x));
  }

  /**
   * Collects entries into a Map.
   * @returns A Map from the entries
   * @example
   * ```ts
   * const iter = Iter.from([['a', 1], ['b', 2]] as const);
   * iter.toMap(); // Map { 'a' => 1, 'b' => 2 }
   * ```
   */
  toMap(): T extends readonly [infer A, infer B] ? Map<A, B> : never {
    return this.collect(
      x => new Map(x as Iterable<[unknown, unknown]>)
    ) as T extends readonly [infer A, infer B] ? Map<A, B> : never;
  }

  [Symbol.iterator](): Iterator<T> {
    return this.#value[Symbol.iterator]();
  }
}
