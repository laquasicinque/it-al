import { describe, it, expect } from 'vitest';
import { count } from '../src/count';

describe('count', () => {
  it('counts elements in an array', () => {
    expect(count([1, 2, 3, 4, 5])).toBe(5);
  });

  it('counts elements in an empty array', () => {
    expect(count([])).toBe(0);
  });

  it('counts elements in a Set', () => {
    expect(count(new Set([1, 2, 3]))).toBe(3);
  });

  it('counts elements in a Map', () => {
    expect(count(new Map([['a', 1], ['b', 2]]))).toBe(2);
  });

  it('counts characters in a string', () => {
    expect(count('hello')).toBe(5);
  });

  it('counts elements in a generator', () => {
    function* gen() {
      yield 1;
      yield 2;
      yield 3;
    }
    expect(count(gen())).toBe(3);
  });
});