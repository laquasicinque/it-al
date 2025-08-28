import { describe, it, expect } from 'vitest';
import { last } from '../src/last';

describe('last', () => {
  it('returns last element of array', () => {
    const result = last([1, 2, 3, 4, 5]);
    expect(result).toBe(5);
  });

  it('returns last element of single element array', () => {
    const result = last([42]);
    expect(result).toBe(42);
  });

  it('returns undefined for empty array', () => {
    const result = last([]);
    expect(result).toBeUndefined();
  });

  it('returns last character of string', () => {
    const result = last('hello');
    expect(result).toBe('o');
  });

  it('returns undefined for empty string', () => {
    const result = last('');
    expect(result).toBeUndefined();
  });

  it('returns last element from Set', () => {
    const result = last(new Set([3, 1, 2]));
    expect(result).toBe(2);
  });

  it('returns last element from generator', () => {
    function* gen() {
      yield 'a';
      yield 'b';
      yield 'c';
    }
    const result = last(gen());
    expect(result).toBe('c');
  });

  it('handles mixed types', () => {
    const result = last(['hello', null, 42]);
    expect(result).toBe(42);
  });

  it('returns last element even if it is falsy', () => {
    const result = last([1, 2, 0]);
    expect(result).toBe(0);
  });

  it('returns last element even if it is false', () => {
    const result = last([true, false, true]);
    expect(result).toBe(true);
  });
});