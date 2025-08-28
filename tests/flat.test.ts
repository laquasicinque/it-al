import { describe, it, expect } from 'vitest';
import { flat } from '../src/flat';

describe('flat', () => {
  it('flattens nested arrays by default depth 1', () => {
    const result = [...flat([[1, 2], [3, 4], [5]])];
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it('flattens to specified depth', () => {
    const result = [...flat([[[1, 2]], [[3, 4]]], 2)];
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('works in curried form', () => {
    const flattenDeep = flat(2);
    const result = [...flattenDeep([[[1, 2]], [[3, 4]]])];
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('flattens mixed depth arrays', () => {
    const result = [...flat([1, [2, 3], [[4, 5]], [[[6]]]], 1)];
    expect(result).toEqual([1, 2, 3, [4, 5], [[6]]]);
  });

  it('flattens to depth 2', () => {
    const result = [...flat([1, [2, 3], [[4, 5]], [[[6]]]], 2)];
    expect(result).toEqual([1, 2, 3, 4, 5, [6]]);
  });

  it('handles empty arrays', () => {
    const result = [...flat([[], [1, 2], [], [3]], 1)];
    expect(result).toEqual([1, 2, 3]);
  });

  it('does not flatten strings', () => {
    const result = [...flat(['hello', ['world']], 1)];
    expect(result).toEqual(['hello', 'world']);
  });

  it('flattens Set contents', () => {
    const result = [...flat([new Set([1, 2]), [3, 4]], 1)];
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('depth 0 returns original', () => {
    const nested = [[1, 2], [3, 4]];
    const result = [...flat(nested, 0)];
    expect(result).toEqual([[1, 2], [3, 4]]);
  });
});