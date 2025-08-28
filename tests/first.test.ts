import { describe, it, expect } from 'vitest';
import { first } from '../src/first';

describe('first', () => {
  it('returns first element of array', () => {
    const result = first([1, 2, 3, 4, 5]);
    expect(result).toBe(1);
  });

  it('returns first element of single element array', () => {
    const result = first([42]);
    expect(result).toBe(42);
  });

  it('returns undefined for empty array', () => {
    const result = first([]);
    expect(result).toBeUndefined();
  });

  it('returns first character of string', () => {
    const result = first('hello');
    expect(result).toBe('h');
  });

  it('returns undefined for empty string', () => {
    const result = first('');
    expect(result).toBeUndefined();
  });

  it('returns first element from Set', () => {
    const result = first(new Set([3, 1, 2]));
    expect(result).toBe(3);
  });

  it('returns first element from generator', () => {
    function* gen() {
      yield 'a';
      yield 'b';
      yield 'c';
    }
    const result = first(gen());
    expect(result).toBe('a');
  });

  it('handles mixed types', () => {
    const result = first([null, 'hello', 42]);
    expect(result).toBeNull();
  });

  it('returns first element even if it is falsy', () => {
    const result = first([0, 1, 2]);
    expect(result).toBe(0);
  });

  it('returns first element even if it is false', () => {
    const result = first([false, true, false]);
    expect(result).toBe(false);
  });
});