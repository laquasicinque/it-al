import { describe, it, expect } from 'vitest';
import { take } from '../src/take';

describe('take', () => {
  it('takes first n elements from array', () => {
    const result = [...take([1, 2, 3, 4, 5], 3)];
    expect(result).toEqual([1, 2, 3]);
  });

  it('works in curried form', () => {
    const takeThree = take(3);
    const result = [...takeThree([1, 2, 3, 4, 5])];
    expect(result).toEqual([1, 2, 3]);
  });

  it('takes all elements when count exceeds length', () => {
    const result = [...take([1, 2, 3], 5)];
    expect(result).toEqual([1, 2, 3]);
  });

  it('takes zero elements', () => {
    const result = [...take([1, 2, 3], 0)];
    expect(result).toEqual([]);
  });

  it('takes from empty array', () => {
    const result = [...take([], 3)];
    expect(result).toEqual([]);
  });

  it('takes from string', () => {
    const result = [...take('hello', 3)];
    expect(result).toEqual(['h', 'e', 'l']);
  });

  it('takes from Set', () => {
    const result = [...take(new Set([1, 2, 3, 4]), 2)];
    expect(result).toEqual([1, 2]);
  });

  it('takes from generator', () => {
    function* gen() {
      yield 1;
      yield 2;
      yield 3;
      yield 4;
    }
    const result = [...take(gen(), 2)];
    expect(result).toEqual([1, 2]);
  });

  it('handles negative count', () => {
    const result = [...take([1, 2, 3], -1)];
    expect(result).toEqual([]);
  });
});