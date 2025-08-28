import { describe, it, expect } from 'vitest';
import { some } from '../src/some';

describe('some', () => {
  it('returns true when at least one element passes predicate', () => {
    const result = some([1, 3, 4, 5], x => x % 2 === 0);
    expect(result).toBe(true);
  });

  it('returns false when no elements pass predicate', () => {
    const result = some([1, 3, 5, 7], x => x % 2 === 0);
    expect(result).toBe(false);
  });

  it('uses index parameter', () => {
    const result = some(['a', 'b', 'c'], (item, index) => index === 1);
    expect(result).toBe(true);
  });

  it('works in curried form', () => {
    const hasEven = some((x: number) => x % 2 === 0);
    expect(hasEven([1, 3, 4])).toBe(true);
    expect(hasEven([1, 3, 5])).toBe(false);
  });

  it('returns false for empty array', () => {
    const result = some([], () => true);
    expect(result).toBe(false);
  });

  it('short circuits on first true', () => {
    let callCount = 0;
    const result = some([1, 2, 3, 4, 5], x => {
      callCount++;
      return x === 3;
    });
    expect(result).toBe(true);
    expect(callCount).toBe(3); // Should stop after finding 3
  });

  it('works with string characters', () => {
    const result = some('hello', char => char === 'l');
    expect(result).toBe(true);
  });

  it('works with Set elements', () => {
    const result = some(new Set([1, 3, 4]), x => x % 2 === 0);
    expect(result).toBe(true);
  });
});