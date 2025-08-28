import { describe, it, expect } from 'vitest';
import { until } from '../src/until';
import { takeWhile } from '../src/takeWhile';

describe('until', () => {
  it('takes elements until predicate becomes true', () => {
    const result = [...until([1, 2, 3, 4, 5], x => x > 3)];
    expect(result).toEqual([1, 2, 3]);
  });

  it('stops immediately when predicate is true', () => {
    const result = [...until([1, 2, 3, 4, 5], x => x === 3)];
    expect(result).toEqual([1, 2]);
  });

  it('uses index parameter', () => {
    const result = [...until(['a', 'b', 'c', 'd'], (item, index) => index === 2)];
    expect(result).toEqual(['a', 'b']);
  });

  it('works in curried form', () => {
    const untilBig = until((x: number) => x > 3);
    const result = [...untilBig([1, 2, 3, 4, 5])];
    expect(result).toEqual([1, 2, 3]);
  });

  it('takes all elements if predicate never becomes true', () => {
    const result = [...until([1, 2, 3], x => x > 10)];
    expect(result).toEqual([1, 2, 3]);
  });

  it('takes no elements if predicate is immediately true', () => {
    const result = [...until([5, 1, 2, 3], x => x > 3)];
    expect(result).toEqual([]);
  });

  it('takes from empty array', () => {
    const result = [...until([], () => true)];
    expect(result).toEqual([]);
  });

  it('works with string characters', () => {
    const result = [...until('hello', char => char === 'l')];
    expect(result).toEqual(['h', 'e']);
  });

  it('works with Set elements', () => {
    const result = [...until(new Set([1, 2, 3, 4]), x => x > 2)];
    expect(result).toEqual([1, 2]);
  });

  it('is similar to takeWhile but with negated condition', () => {
    const data = [1, 2, 3, 4, 5];
    const untilResult = [...until(data, x => x > 3)];
    const takeWhileResult = [...takeWhile(data, x => x <= 3)];
    expect(untilResult).toEqual(takeWhileResult);
  });
});