import { describe, it, expect } from 'vitest';
import { skip } from '../src/skip';

describe('skip', () => {
  it('skips first n elements from array', () => {
    const result = [...skip([1, 2, 3, 4, 5], 2)];
    expect(result).toEqual([3, 4, 5]);
  });

  it('works in curried form', () => {
    const skipTwo = skip(2);
    const result = [...skipTwo([1, 2, 3, 4, 5])];
    expect(result).toEqual([3, 4, 5]);
  });

  it('skips all elements when count exceeds length', () => {
    const result = [...skip([1, 2, 3], 5)];
    expect(result).toEqual([]);
  });

  it('skips zero elements', () => {
    const result = [...skip([1, 2, 3], 0)];
    expect(result).toEqual([1, 2, 3]);
  });

  it('skips from empty array', () => {
    const result = [...skip([], 3)];
    expect(result).toEqual([]);
  });

  it('skips from string', () => {
    const result = [...skip('hello', 2)];
    expect(result).toEqual(['l', 'l', 'o']);
  });

  it('skips from Set', () => {
    const result = [...skip(new Set([1, 2, 3, 4]), 2)];
    expect(result).toEqual([3, 4]);
  });

  it('skips from generator', () => {
    function* gen() {
      yield 1;
      yield 2;
      yield 3;
      yield 4;
    }
    const result = [...skip(gen(), 2)];
    expect(result).toEqual([3, 4]);
  });

  it('handles negative count', () => {
    const result = [...skip([1, 2, 3], -1)];
    expect(result).toEqual([1, 2, 3]);
  });
});