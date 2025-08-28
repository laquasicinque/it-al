import { describe, it, expect } from 'vitest';
import { range } from '../src/range';

describe('range', () => {
  it('creates range from 0 to stop (inclusive)', () => {
    const result = [...range(5)];
    expect(result).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('creates range from start to stop (inclusive)', () => {
    const result = [...range(6, 2)];
    expect(result).toEqual([2, 3, 4, 5, 6]);
  });

  it('creates range with custom step', () => {
    const result = [...range(10, 0, 2)];
    expect(result).toEqual([0, 2, 4, 6, 8, 10]);
  });

  it('creates single point range when stop == start', () => {
    const result = [...range(5, 5)];
    expect(result).toEqual([5]);
  });

  it('creates decreasing range when stop < start', () => {
    const result = [...range(3, 5)];
    expect(result).toEqual([5, 4, 3]);
  });

  it('creates range from 0 to 0', () => {
    const result = [...range(0)];
    expect(result).toEqual([0]);
  });

  it('handles negative start values', () => {
    const result = [...range(3, -2)];
    expect(result).toEqual([-2, -1, 0, 1, 2, 3]);
  });

  it('handles negative step values', () => {
    const result = [...range(0, 10, -2)];
    expect(result).toEqual([10, 8, 6, 4, 2, 0]);
  });

  it('creates range from 0 to 1', () => {
    const result = [...range(1)];
    expect(result).toEqual([0, 1]);
  });

  it('handles large ranges efficiently', () => {
    const gen = range(1000000);
    const iterator = gen[Symbol.iterator]();
    expect(iterator.next().value).toBe(0);
    expect(iterator.next().value).toBe(1);
  });

  it('works with decimal steps', () => {
    const result = [...range(2, 0, 0.5)];
    expect(result).toEqual([0, 0.5, 1, 1.5, 2]);
  });

  it('handles fractional start and stop', () => {
    const result = [...range(4.5, 1.5)];
    expect(result).toEqual([1.5, 2.5, 3.5, 4.5]);
  });
});