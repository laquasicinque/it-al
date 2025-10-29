# It-al

A TypeScript iterable utility library providing functional programming utilities for working with iterables as well as a class based interface with an easy chainable and typed API.

## Installation

```bash
npm install it-al
```

## Features

- 🔄 **Lazy Evaluation** - Iterator-based operations are efficient and composable
- 🍛 **Currying Support** - Most functions support both direct and curried forms
- 🔗 **Method Chaining** - Fluent API via `Iter` and `PeekableIter` classes
- 🏷️ **Type Safe** - Full TypeScript support with proper type inference
- 🧩 **Functional** - Supports composition via `pipe` and `apply`

## Quick Start

```typescript
import { Iter, map, filter, take } from 'it-al';

// Functional style
const result = pipe([
  map((x: number) => x * 2),
  filter((x: number) => x > 5),
  take(3)
])([1, 2, 3, 4, 5, 6]);

// Method chaining style
const result2 = Iter.from([1, 2, 3, 4, 5, 6])
  .map(x => x * 2)
  .filter(x => x > 5)
  .take(3)
  .toArray();
```

## API Reference

### Transformation Functions

| Function | Description | Signature |
|----------|-------------|-----------|
| [`map`](src/map.ts#L13) | Transform each item in an iterable | `<T, U>(iter: Iterable<T>, fn: IterFn<T, U>) => IterableIterator<U>` |
| [`filter`](src/filter.ts#L29) | Filter items based on a predicate | `<T>(iter: Iterable<T>, fn: IterFn<T>) => IterableIterator<T>` |
| [`flat`](src/flat.ts#L34) | Flatten nested iterables by depth | `<T, D>(iter: Iterable<T>, depth?: D) => IterableIterator<FlatItem<T, D>>` |
| [`enumerate`](src/enumerate.ts#L1) | Return index-value pairs | `<T>(iter: Iterable<T>) => IterableIterator<[number, T]>` |
| [`pluck`](src/pluck.ts#L21) | Extract a property from each item | `<T, K>(iter: Iterable<T>, key: K) => IterableIterator<T[K]>` |
| [`tap`](src/tap.ts#L5) | Run side effects without modifying items | `<T>(iter: Iterable<T>, fn: IterFn<T>) => IterableIterator<T>` |
| [`scan`](src/scan.ts#L15) | Like reduce but yields intermediate values | `<T, U>(iter: Iterable<T>, fn, start?: U) => IterableIterator<U>` |

### Slicing & Limiting

| Function | Description | Signature |
|----------|-------------|-----------|
| [`take`](src/take.ts#L16) | Take first n items | `<T>(iter: Iterable<T>, n: number) => IterableIterator<T>` |
| [`skip`](src/skip.ts#L16) | Skip first n items | `<T>(iter: Iterable<T>, n: number) => IterableIterator<T>` |
| [`takeWhile`](src/takeWhile.ts#L18) | Take items while predicate is true | `<T>(iter: Iterable<T>, fn: IterFn<T>) => IterableIterator<T>` |
| [`skipWhile`](src/skipWhile.ts#L18) | Skip items while predicate is true | `<T>(iter: Iterable<T>, fn: IterFn<T>) => IterableIterator<T>` |
| [`until`](src/until.ts#L15) | Take items until predicate is true | `<T>(iter: Iterable<T>, fn: IterFn<T>) => IterableIterator<T>` |
| [`chunk`](src/chunk.ts#L16) | Split into chunks of size n | `<T>(iter: Iterable<T>, n: number) => IterableIterator<T[]>` |
| [`windows`](src/windows.ts#L16) | Create sliding windows of size n | `<T>(iter: Iterable<T>, n: number) => IterableIterator<T[]>` |

### Aggregation & Reduction

| Function | Description | Signature |
|----------|-------------|-----------|
| [`reduce`](src/reduce.ts#L12) | Reduce to a single value | `<T, U>(iter: Iterable<T>, fn, start: U) => U` |
| [`sum`](src/sum.ts#L4) | Sum all numbers | `(iter: Iterable<number>) => number` |
| [`product`](src/product.ts#L4) | Multiply all numbers | `(iter: Iterable<number>) => number` |
| [`average`](src/average.ts#L4) | Average all numbers | `(iter: Iterable<number>) => number` |
| [`count`](src/count.ts#L1) | Count items | `<T>(iter: Iterable<T>) => number` |
| [`join`](src/join.ts#L13) | Join items into string | `<T>(iter: Iterable<T>, delimiter?: string) => string` |
| [`groupBy`](src/groupBy.ts#L11) | Group items by key | `<T, U>(iter: Iterable<T>, fn) => Map<U, T[]>` |

### Searching & Testing

| Function | Description | Signature |
|----------|-------------|-----------|
| [`find`](src/find.ts#L9) | Find first matching item | `<T>(iter: Iterable<T>, fn: IterFn<T>) => T \| null` |
| [`findIndex`](src/findIndex.ts#L5) | Find index of first match | `<T>(iter: Iterable<T>, fn: IterFn<T>) => number` |
| [`includes`](src/includes.ts#L6) | Check if value exists | `<T>(iter: Iterable<T>, value: T) => boolean` |
| [`some`](src/some.ts#L13) | Test if any item matches | `<T>(iter: Iterable<T>, fn: IterFn<T>) => boolean` |
| [`every`](src/every.ts#L13) | Test if all items match | `<T>(iter: Iterable<T>, fn: IterFn<T>) => boolean` |
| [`first`](src/first.ts#L9) | Get first item | `<T>(iter: Iterable<T>) => T` |
| [`last`](src/last.ts#L8) | Get last item | `<T>(iter: Iterable<T>) => T \| undefined` |
| [`isEmpty`](src/isEmpty.ts#L1) | Check if empty | `(iter: Iterable<unknown>) => boolean` |
| [`search`](src/search.ts#L20) | Recursively search object | `<U>(obj: unknown, fn) => IterableIterator<KeyValuePair<U>>` |

### Uniqueness & Filtering

| Function | Description | Signature |
|----------|-------------|-----------|
| [`uniqueBy`](src/uniqueBy.ts#L8) | Get unique items by selector | `<T>(iter: Iterable<T>, fn: IterFn<T>) => IterableIterator<T>` |
| [`partition`](src/partition.ts#L27) | Split into passed/failed arrays | `<T>(iter: Iterable<T>, fn: IterFn<T>) => [T[], T[]]` |

### Combining & Zipping

| Function | Description | Signature |
|----------|-------------|-----------|
| [`zip`](src/zip.ts#L38) | Combine multiple iterables | `<I>(...iters: I, stopOnMin?: boolean) => ZipOutput<I>` |
| [`unzip`](src/unzip.ts#L29) | Transpose iterable of arrays | `<T>(iter: Iterable<T>) => UnzipOutput<T>` |

### Generation & Repetition

| Function | Description | Signature |
|----------|-------------|-----------|
| [`range`](src/range.ts#L7) | Generate range of numbers | `(stop: number, start?: number, step?: number) => IterableIterator<number>` |
| [`repeat`](src/repeat.ts#L13) | Repeat iterable n times | `<T>(iter: Iterable<T>, n: number) => IterableIterator<T>` |
| [`cycle`](src/cycle.ts#L10) | Cycle through iterable infinitely | `<T>(iter: Iterable<T>) => IterableIterator<T>` |
| [`gen`](src/gen.ts#L5) | Create infinite generator | `<T>(fn: (n: number) => T) => () => IterableIterator<T>` |

### Object/Entry Operations

| Function | Description | Signature |
|----------|-------------|-----------|
| [`entries`](src/entries.ts#L19) | Get key-value pairs | `<T>(input: T) => IterableIterator<Entry<T>>` |
| [`allEntries`](src/allEntries.ts#L23) | Get entries including Symbols | `<T>(input: T) => IterableIterator<Entry<T>>` |
| [`fromEntries`](src/fromEntries.ts#L3) | Create object from entries | `<K, V>(iter: Iterable<[K, V]>) => Record<K, V>` |

### Utilities

| Function | Description | Signature |
|----------|-------------|-----------|
| [`pipe`](src/pipe.ts#L48) | Compose functions left-to-right | `<I, O>(fns: Function[]) => (item: I) => O` |
| [`apply`](src/pipe.ts#L26) | Apply functions in order | `<I, O>(input: I, fns: Function[]) => O` |
| [`peekable`](src/peekable.ts#L9) | Create peekable iterable | `<T>(iter: Iterable<T>) => Peekable<T>` |
| [`isIterable`](src/isIterable.ts#L4) | Check if value is iterable | `<T>(x: unknown) => x is Iterable<T>` |
| [`isNonStringIterable`](src/isIterable.ts#L8) | Check iterable (not string) | `<T>(x: unknown) => x is Iterable<T>` |
| [`isAsyncIterable`](src/isAsyncIterable.ts#L4) | Check if async iterable | `<T>(x: unknown) => x is AsyncIterable<T>` |

## Class-Based API

### `Iter<T>`

Chainable wrapper around iterables providing a fluent API.

#### Static Methods

| Method | Description | Return Type |
|--------|-------------|-------------|
| [`Iter#from(iterable)`](src/Iter.ts#L57) | Create an Iter from any iterable | `Iter<T>` |
| [`Iter#fromAsync(iterable)`](src/Iter.ts#L61) | Create an Iter from async iterable or promises | `Iter<T>` |
| [`Iter#fromEntries(obj)`](src/Iter.ts#L74) | Create an Iter from object entries | `Iter<[K, V]>` |
| [`Iter#fromRange(stop, start?, step?)`](src/Iter.ts#L78) | Create an Iter from a numeric range | `Iter<number>` |
| [`Iter#gen(fn)`](src/Iter.ts#L82) | Create infinite Iter using generator function | `() => Iter<T>` |
| [`Iter#zip(...iterables, stopOnMin?)`](src/Iter.ts#L86) | Zip multiple iterables into tuples | `Iter<[...]>` |
| [`Iter#search(obj, fn, skipAfterYield?)`](src/Iter.ts#L93) | Recursively search object for matching values | `Iter<KeyValuePair<U>>` |

#### Chainable Methods

Returns a new `Iter<T>` instance for continued chaining.

| Method | Description |
|--------|-------------|
| [`Iter#map(fn)`](src/Iter.ts#L115) | Transform each item |
| [`Iter#filter(fn)`](src/Iter.ts#L119) | Filter items by predicate |
| [`Iter#filterNullish()`](src/Iter.ts#L123) | Remove null and undefined values |
| [`Iter#flat(depth?)`](src/Iter.ts#L109) | Flatten nested iterables |
| [`Iter#flatMap(fn)`](src/Iter.ts#L105) | Map and flatten in one step |
| [`Iter#pluck(key)`](src/Iter.ts#L152) | Extract property from each item |
| [`Iter#tap(fn)`](src/Iter.ts#L139) | Run side effects without modifying items |
| [`Iter#take(n)`](src/Iter.ts#L156) | Take first n items |
| [`Iter#skip(n)`](src/Iter.ts#L164) | Skip first n items |
| [`Iter#takeWhile(fn)`](src/Iter.ts#L168) | Take items while predicate is true |
| [`Iter#skipWhile(fn)`](src/Iter.ts#L172) | Skip items while predicate is true |
| [`Iter#until(fn)`](src/Iter.ts#L176) | Take items until predicate is true |
| [`Iter#chunk(n)`](src/Iter.ts#L160) | Split into chunks of size n |
| [`Iter#windows(size)`](src/Iter.ts#L180) | Create sliding windows of size n |
| [`Iter#enumerate()`](src/Iter.ts#L131) | Add index to each item as [index, value] |
| [`Iter#unique()`](src/Iter.ts#L127) | Remove duplicate values |
| [`Iter#uniqueBy(fn)`](src/Iter.ts#L135) | Remove duplicates by selector function |
| [`Iter#scan(fn, start?)`](src/Iter.ts#L143) | Like reduce but yields intermediate values |
| [`Iter#repeat(times)`](src/Iter.ts#L289) | Repeat the iterable n times |
| [`Iter#cycle()`](src/Iter.ts#L293) | Cycle through iterable infinitely |
| [`Iter#apply(fn)`](src/Iter.ts#L184) | Apply a function to the iterable |
| [`Iter#peekable()`](src/Iter.ts#L255) | Convert to PeekableIter |

#### Terminal Methods

Consumes the iterator and returns a final value.

| Method | Description | Return Type |
|--------|-------------|-------------|
| [`Iter#toArray()`](src/Iter.ts#L297) | Collect all items into an array | `T[]` |
| [`Iter#toSet()`](src/Iter.ts#L301) | Collect all items into a Set | `Set<T>` |
| [`Iter#toMap()`](src/Iter.ts#L305) | Collect entries into a Map | `Map<K, V>` |
| [`Iter#collect(collector?)`](src/Iter.ts#L283) | Collect using custom collector | `U` |
| [`Iter#first()`](src/Iter.ts#L189) | Get the first item | `T` |
| [`Iter#last()`](src/Iter.ts#L193) | Get the last item | `T \| undefined` |
| [`Iter#find(fn)`](src/Iter.ts#L197) | Find first item matching predicate | `T \| null` |
| [`Iter#findIndex(fn)`](src/Iter.ts#L201) | Find index of first match | `number` |
| [`Iter#includes(value)`](src/Iter.ts#L205) | Check if value exists | `boolean` |
| [`Iter#isEmpty()`](src/Iter.ts#L213) | Check if iterable is empty | `boolean` |
| [`Iter#every(fn)`](src/Iter.ts#L221) | Test if all items match predicate | `boolean` |
| [`Iter#some(fn)`](src/Iter.ts#L225) | Test if any item matches predicate | `boolean` |
| [`Iter#count()`](src/Iter.ts#L209) | Count total items | `number` |
| [`Iter#reduce(fn, start)`](src/Iter.ts#L217) | Reduce to single value | `U` |
| [`Iter#join(delimiter?)`](src/Iter.ts#L243) | Join items into string | `string` |
| [`Iter#sum()`](src/Iter.ts#L261) | Sum all numbers | `number` |
| [`Iter#product()`](src/Iter.ts#L265) | Multiply all numbers | `number` |
| [`Iter#average()`](src/Iter.ts#L269) | Average all numbers | `number` |
| [`Iter#min()`](src/Iter.ts#L273) | Find minimum value | `T` |
| [`Iter#max()`](src/Iter.ts#L277) | Find maximum value | `T` |
| [`Iter#partition(fn)`](src/Iter.ts#L239) | Split into [passed, failed] arrays | `[T[], T[]]` |
| [`Iter#groupBy(fn)`](src/Iter.ts#L247) | Group items by key | `Map<K, T[]>` |
| [`Iter#unzip()`](src/Iter.ts#L229) | Transpose iterable of arrays | `UnzipOutput<T>` |

### `PeekableIter<T>`

Extends `Iter<T>` with the ability to peek at the next value without consuming it.

```typescript
const iter = PeekableIter.from([1, 2, 3]);
console.log(iter.peek()); // 1 (doesn't consume)
console.log(iter.first()); // 1 (consumes)
```

#### Additional Method

| Method | Description | Return Type |
|--------|-------------|-------------|
| [`PeekableIter#peek()`](src/PeekableIter.ts#L78) | Look at next value without consuming it | `T \| undefined` |

## Examples

### Currying

```typescript
import { map, filter, pipe } from 'it-al';

// Curried form
const double = map((x: number) => x * 2);
const isPowerOfTwo = filter((x: number) => Math.sqrt(x, 2) % 1 === 0);

const result = pipe([double, isPowerOfTwo])([1, 2, 3, 4]);
// [2, 4, 8]
```

### Method Chaining

```typescript
import { Iter } from 'it-al';

const result = Iter.from([1, 2, 3, 4, 5])
  .map(x => x * 2)
  .filter(x => x > 5)
  .take(2)
  .toArray();
// [6, 8]
```

### Lazy Evaluation

```typescript
import { map, take } from 'it-al';

const expensive = map((x: number) => {
  console.log('Processing:', x);
  return x * 2;
});

// Only processes first 3 items
const result = take(expensive([1, 2, 3, 4, 5, 6, 7, 8]), 3);

for (const _ of result) {}
// Logs: Processing: 1, 2, 3
```

### Working with Infinite Iterators

```typescript
import { Iter } from 'it-al';

// Generate infinite sequence
const randomNumbers = Iter.gen((n) => Math.random());

// Generates 10 random numbers
const first10 = fibonacci().take(10).toArray();
```

### Grouping and Aggregation

```typescript
import { Iter } from 'it-al';

const data = [
  { category: 'A', value: 10 },
  { category: 'B', value: 20 },
  { category: 'A', value: 30 },
];

const grouped = Iter.from(data).groupBy(item => item.category);
// Map { 'A' => [{...}, {...}], 'B' => [{...}] }
```
