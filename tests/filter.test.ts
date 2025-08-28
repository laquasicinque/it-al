import { describe, it, expect } from 'vitest';
import { filter } from '../src/filter';

describe('filter', () => {
  it('filters array elements', () => {
    const result = [...filter([1, 2, 3, 4, 5], x => x % 2 === 0)];
    expect(result).toEqual([2, 4]);
  });

  it('filters with index parameter', () => {
    const result = [...filter(['a', 'b', 'c', 'd'], (item, index) => index % 2 === 0)];
    expect(result).toEqual(['a', 'c']);
  });

  it('works in curried form', () => {
    const isEven = filter((x: number) => x % 2 === 0);
    const result = [...isEven([1, 2, 3, 4])];
    expect(result).toEqual([2, 4]);
  });

  it('filters empty array', () => {
    const result = [...filter([], () => true)];
    expect(result).toEqual([]);
  });

  it('returns empty when no elements match', () => {
    const result = [...filter([1, 3, 5], x => x % 2 === 0)];
    expect(result).toEqual([]);
  });

  it('filters string characters', () => {
    const result = [...filter('hello', char => char !== 'l')];
    expect(result).toEqual(['h', 'e', 'o']);
  });

  it('filters Set elements', () => {
    const result = [...filter(new Set([1, 2, 3, 4]), x => x > 2)];
    expect(result).toEqual([3, 4]);
  });

  it('works with type guards', () => {
    const mixed: (string | number)[] = ['a', 1, 'b', 2];
    const numbers = [...filter(mixed, (x): x is number => typeof x === 'number')];
    expect(numbers).toEqual([1, 2]);
    // TypeScript should infer numbers as number[]
    expect(typeof numbers[0]).toBe('number');
  });
});