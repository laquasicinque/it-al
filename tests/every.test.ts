import { describe, it, expect } from 'vitest';
import { every } from '../src/every';

describe('every', () => {
  it('returns true when all elements pass predicate', () => {
    const result = every([2, 4, 6, 8], x => x % 2 === 0);
    expect(result).toBe(true);
  });

  it('returns false when some elements fail predicate', () => {
    const result = every([2, 4, 5, 8], x => x % 2 === 0);
    expect(result).toBe(false);
  });

  it('uses index parameter', () => {
    const result = every(['a', 'b', 'c'], (item, index) => index < 3);
    expect(result).toBe(true);
  });

  it('works in curried form', () => {
    const allEven = every((x: number) => x % 2 === 0);
    expect(allEven([2, 4, 6])).toBe(true);
    expect(allEven([2, 4, 5])).toBe(false);
  });

  it('returns true for empty array', () => {
    const result = every([], () => false);
    expect(result).toBe(true);
  });

  it('short circuits on first false', () => {
    let callCount = 0;
    const result = every([1, 2, 3, 4, 5], x => {
      callCount++;
      return x < 3;
    });
    expect(result).toBe(false);
    expect(callCount).toBe(3); // Should stop after finding 3
  });

  it('works with string characters', () => {
    const result = every('hello', char => char !== 'z');
    expect(result).toBe(true);
  });

  it('works with Set elements', () => {
    const result = every(new Set([2, 4, 6]), x => x % 2 === 0);
    expect(result).toBe(true);
  });
});