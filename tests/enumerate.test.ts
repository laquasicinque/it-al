import { describe, it, expect } from 'vitest';
import { enumerate } from '../src/enumerate';

describe('enumerate', () => {
  it('enumerates array elements with indices', () => {
    const result = [...enumerate(['a', 'b', 'c'])];
    expect(result).toEqual([[0, 'a'], [1, 'b'], [2, 'c']]);
  });

  it('enumerates empty array', () => {
    const result = [...enumerate([])];
    expect(result).toEqual([]);
  });

  it('enumerates string characters', () => {
    const result = [...enumerate('hi')];
    expect(result).toEqual([[0, 'h'], [1, 'i']]);
  });

  it('enumerates Set elements', () => {
    const result = [...enumerate(new Set([10, 20, 30]))];
    expect(result).toEqual([[0, 10], [1, 20], [2, 30]]);
  });

  it('enumerates Map entries', () => {
    const map = new Map([['x', 1], ['y', 2]]);
    const result = [...enumerate(map)];
    expect(result).toEqual([[0, ['x', 1]], [1, ['y', 2]]]);
  });

  it('enumerates generator values', () => {
    function* gen() {
      yield 'first';
      yield 'second';
    }
    const result = [...enumerate(gen())];
    expect(result).toEqual([[0, 'first'], [1, 'second']]);
  });
});