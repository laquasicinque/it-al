import { describe, it, expect } from 'vitest';
import { skipWhile } from '../src/skipWhile';

describe('skipWhile', () => {
  it('skips elements while predicate is true', () => {
    const result = [...skipWhile([1, 2, 3, 4, 5], x => x < 3)];
    expect(result).toEqual([3, 4, 5]);
  });

  it('starts yielding after first false predicate', () => {
    const result = [...skipWhile([1, 3, 4, 6, 7], x => x % 2 === 1)];
    expect(result).toEqual([4, 6, 7]);
  });

  it('uses index parameter', () => {
    const result = [...skipWhile(['a', 'b', 'c', 'd'], (item, index) => index < 2)];
    expect(result).toEqual(['c', 'd']);
  });

  it('works in curried form', () => {
    const skipWhileSmall = skipWhile((x: number) => x < 3);
    const result = [...skipWhileSmall([1, 2, 3, 4])];
    expect(result).toEqual([3, 4]);
  });

  it('skips all elements if all match', () => {
    const result = [...skipWhile([1, 2, 3], x => x < 10)];
    expect(result).toEqual([]);
  });

  it('skips no elements if first fails', () => {
    const result = [...skipWhile([5, 1, 2, 3], x => x < 3)];
    expect(result).toEqual([5, 1, 2, 3]);
  });

  it('skips from empty array', () => {
    const result = [...skipWhile([], () => true)];
    expect(result).toEqual([]);
  });

  it('works with string characters', () => {
    const result = [...skipWhile('hello', char => char !== 'l')];
    expect(result).toEqual(['l', 'l', 'o']);
  });

  it('works with Set elements', () => {
    const result = [...skipWhile(new Set([1, 2, 3, 4]), x => x < 3)];
    expect(result).toEqual([3, 4]);
  });

  it('continues yielding after condition becomes false', () => {
    const result = [...skipWhile([1, 2, 4, 1, 5], x => x < 3)];
    expect(result).toEqual([4, 1, 5]); // Includes the 1 after 4
  });
});