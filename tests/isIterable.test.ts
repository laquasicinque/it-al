import { describe, it, expect } from 'vitest';
import { isIterable } from '../src/isIterable';

describe('isIterable', () => {
  it('returns true for arrays', () => {
    expect(isIterable([1, 2, 3])).toBe(true);
    expect(isIterable([])).toBe(true);
  });

  it('returns true for strings', () => {
    expect(isIterable('hello')).toBe(true);
    expect(isIterable('')).toBe(true);
  });

  it('returns true for Sets', () => {
    expect(isIterable(new Set([1, 2, 3]))).toBe(true);
    expect(isIterable(new Set())).toBe(true);
  });

  it('returns true for Maps', () => {
    expect(isIterable(new Map([['a', 1]]))).toBe(true);
    expect(isIterable(new Map())).toBe(true);
  });

  it('returns true for generators', () => {
    function* gen() {
      yield 1;
      yield 2;
    }
    expect(isIterable(gen())).toBe(true);
  });

  it('returns false for objects', () => {
    expect(isIterable({ a: 1, b: 2 })).toBe(false);
    expect(isIterable({})).toBe(false);
  });

  it('returns false for numbers', () => {
    expect(isIterable(42)).toBe(false);
    expect(isIterable(0)).toBe(false);
    expect(isIterable(NaN)).toBe(false);
  });

  it('returns false for booleans', () => {
    expect(isIterable(true)).toBe(false);
    expect(isIterable(false)).toBe(false);
  });

  it('returns false for null and undefined', () => {
    expect(isIterable(null)).toBe(false);
    expect(isIterable(undefined)).toBe(false);
  });

  it('returns false for functions', () => {
    expect(isIterable(() => {})).toBe(false);
    expect(isIterable(function() {})).toBe(false);
  });

  it('returns true for custom iterables', () => {
    const customIterable = {
      *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
      }
    };
    expect(isIterable(customIterable)).toBe(true);
  });

  it('returns false for objects with non-function Symbol.iterator', () => {
    const notIterable = {
      [Symbol.iterator]: 'not a function'
    };
    expect(isIterable(notIterable)).toBe(false);
  });

  it('returns true for TypedArrays', () => {
    expect(isIterable(new Int32Array([1, 2, 3]))).toBe(true);
    expect(isIterable(new Uint8Array())).toBe(true);
  });

  it('returns false for symbols', () => {
    expect(isIterable(Symbol('test'))).toBe(false);
  });
});