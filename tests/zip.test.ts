import { describe, it, expect } from 'vitest';
import { zip } from '../src/zip';

describe('zip', () => {
  it('zips two arrays', () => {
    const result = [...zip([[1, 2, 3], ['a', 'b', 'c']])];
    expect(result).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  });

  it('zips arrays of different lengths (stops at shortest by default)', () => {
    const result = [...zip([[1, 2, 3, 4], ['a', 'b']], true)];
    expect(result).toEqual([[1, 'a'], [2, 'b']]);
  });

  it('zips three arrays', () => {
    const result = [...zip([[1, 2], ['a', 'b'], [true, false]])];
    expect(result).toEqual([[1, 'a', true], [2, 'b', false]]);
  });

  it('zips with stopOnMin=false continues to longest', () => {
    const result = [...zip([[1, 2], ['a', 'b', 'c']], false)];
    expect(result).toEqual([[1, 'a'], [2, 'b'], [undefined, 'c']]);
  });

  it('handles empty arrays', () => {
    const result = [...zip([[], [1, 2, 3]], true)];
    expect(result).toEqual([]);
  });

  it('zips single array', () => {
    const result = [...zip([[1, 2, 3]])];
    expect(result).toEqual([[1], [2], [3]]);
  });

  it('zips strings', () => {
    const result = [...zip(['abc', 'xyz'])];
    expect(result).toEqual([['a', 'x'], ['b', 'y'], ['c', 'z']]);
  });

  it('zips mixed iterables', () => {
    const result = [...zip([[1, 2], new Set(['a', 'b'])])];
    expect(result).toEqual([[1, 'a'], [2, 'b']]);
  });
});