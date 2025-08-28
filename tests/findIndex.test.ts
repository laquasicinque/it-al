import { describe, it, expect } from 'vitest';
import { findIndex } from '../src/findIndex';

describe('findIndex', () => {
  it('finds index of first matching element', () => {
    const result = findIndex([1, 2, 3, 4, 5], x => x > 3);
    expect(result).toBe(3);
  });

  it('returns -1 when no element matches', () => {
    const result = findIndex([1, 2, 3], x => x > 10);
    expect(result).toBe(-1);
  });

  it('returns -1 for empty array', () => {
    const result = findIndex([], () => true);
    expect(result).toBe(-1);
  });

  it('uses index parameter in predicate', () => {
    const result = findIndex(['a', 'b', 'c'], (item, index) => index === 1);
    expect(result).toBe(1);
  });

  it('works in curried form', () => {
    const findBig = findIndex((x: number) => x > 3);
    const result = findBig([1, 2, 3, 4, 5]);
    expect(result).toBe(3);
  });

  it('finds first occurrence when multiple matches', () => {
    const result = findIndex([1, 5, 3, 5, 2], x => x === 5);
    expect(result).toBe(1);
  });

  it('works with string characters', () => {
    const result = findIndex('hello', char => char === 'l');
    expect(result).toBe(2);
  });

  it('works with Set elements', () => {
    const result = findIndex(new Set([1, 2, 3, 4]), x => x > 2);
    expect(result).toBe(2);
  });

  it('handles complex objects', () => {
    const items = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 }
    ];
    const result = findIndex(items, item => item.age > 30);
    expect(result).toBe(2);
  });

  it('returns 0 for first element match', () => {
    const result = findIndex([10, 2, 3], x => x > 5);
    expect(result).toBe(0);
  });
});