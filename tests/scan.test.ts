import { describe, it, expect } from 'vitest';
import { scan } from '../src/scan';

describe('scan', () => {
  it('scans array showing running sums', () => {
    const result = [...scan([1, 2, 3, 4], (acc, x) => acc + x, 0)];
    expect(result).toEqual([1, 3, 6, 10]);
  });

  it('scans array showing running products', () => {
    const result = [...scan([2, 3, 4], (acc, x) => acc * x, 1)];
    expect(result).toEqual([2, 6, 24]);
  });

  it('scans with index parameter', () => {
    const result = [...scan(['a', 'b', 'c'], (acc, item, index) => acc + `${index}:${item} `, '')];
    expect(result).toEqual(['0:a ', '0:a 1:b ', '0:a 1:b 2:c ']);
  });

  it('works in curried form', () => {
    const runningSum = scan((acc: number, x: number) => acc + x, 0);
    const result = [...runningSum([1, 2, 3], 0)];
    expect(result).toEqual([1, 3, 6]);
  });

  it('scans empty array', () => {
    const result = [...scan([], (acc: number, x: number) => acc + x, 0)];
    expect(result).toEqual([]);
  });

  it('scans single element', () => {
    const result = [...scan([5], (acc, x) => acc + x, 10)];
    expect(result).toEqual([15]);
  });

  it('scans string characters', () => {
    const result = [...scan('abc', (acc, char) => acc + char, '')];
    expect(result).toEqual(['a', 'ab', 'abc']);
  });

  it('scans to build running max', () => {
    const result = [...scan([3, 1, 4, 1, 5, 2], (acc, x) => Math.max(acc, x), -Infinity)];
    expect(result).toEqual([3, 3, 4, 4, 5, 5]);
  });

  it('scans to build arrays', () => {
    const result = [...scan([1, 2, 3], (acc: number[], x) => [...acc, x * 2], [])];
    expect(result).toEqual([[2], [2, 4], [2, 4, 6]]);
  });
});