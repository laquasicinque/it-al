import { describe, it, expect } from 'vitest';
import { windows } from '../src/windows';

describe('windows', () => {
  it('creates sliding windows of specified size', () => {
    const result = [...windows([1, 2, 3, 4, 5], 3)];
    expect(result).toEqual([
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5]
    ]);
  });

  it('creates windows of size 2', () => {
    const result = [...windows(['a', 'b', 'c', 'd'], 2)];
    expect(result).toEqual([
      ['a', 'b'],
      ['b', 'c'],
      ['c', 'd']
    ]);
  });

  it('works in curried form', () => {
    const windows3 = windows(3);
    const result = [...windows3([1, 2, 3, 4, 5])];
    expect(result).toEqual([
      [1, 2, 3],
      [2, 3, 4],
      [3, 4, 5]
    ]);
  });

  it('returns empty when array is smaller than window size', () => {
    const result = [...windows([1, 2], 3)];
    expect(result).toEqual([]);
  });

  it('returns single window when array equals window size', () => {
    const result = [...windows([1, 2, 3], 3)];
    expect(result).toEqual([[1, 2, 3]]);
  });

  it('returns empty for empty array', () => {
    const result = [...windows([], 2)];
    expect(result).toEqual([]);
  });

  it('creates windows of size 1', () => {
    const result = [...windows([1, 2, 3], 1)];
    expect(result).toEqual([[1], [2], [3]]);
  });

  it('works with string characters', () => {
    const result = [...windows('hello', 2)];
    expect(result).toEqual([
      ['h', 'e'],
      ['e', 'l'],
      ['l', 'l'],
      ['l', 'o']
    ]);
  });

  it('works with Set elements', () => {
    const result = [...windows(new Set([1, 2, 3, 4]), 2)];
    expect(result).toEqual([
      [1, 2],
      [2, 3],
      [3, 4]
    ]);
  });

  it('handles large window sizes gracefully', () => {
    const result = [...windows([1, 2, 3], 10)];
    expect(result).toEqual([]);
  });

  it('handles zero window size', () => {
    const result = [...windows([1, 2, 3], 0)];
    expect(result).toEqual([]);
  });
});