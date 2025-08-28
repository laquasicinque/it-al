import { describe, it, expect } from 'vitest';
import { sum } from '../src/sum';

describe('sum', () => {
  it('sums array of numbers', () => {
    const result = sum([1, 2, 3, 4, 5]);
    expect(result).toBe(15);
  });

  it('sums empty array to zero', () => {
    const result = sum([]);
    expect(result).toBe(0);
  });

  it('sums single element', () => {
    const result = sum([42]);
    expect(result).toBe(42);
  });

  it('sums negative numbers', () => {
    const result = sum([-1, -2, -3]);
    expect(result).toBe(-6);
  });

  it('sums mixed positive and negative', () => {
    const result = sum([10, -5, 3, -2]);
    expect(result).toBe(6);
  });

  it('sums decimal numbers', () => {
    const result = sum([1.5, 2.5, 3.0]);
    expect(result).toBe(7);
  });

  it('sums Set of numbers', () => {
    const result = sum(new Set([1, 2, 3, 4]));
    expect(result).toBe(10);
  });

  it('sums generator values', () => {
    function* numbers() {
      yield 1;
      yield 2;
      yield 3;
    }
    const result = sum(numbers());
    expect(result).toBe(6);
  });

  it('handles very large numbers', () => {
    const result = sum([1e10, 2e10, 3e10]);
    expect(result).toBe(6e10);
  });

  it('handles zero values', () => {
    const result = sum([0, 0, 0, 5]);
    expect(result).toBe(5);
  });
});