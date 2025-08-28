import { describe, it, expect } from 'vitest';
import { average } from '../src/average';

describe('average', () => {
  it('calculates average of numbers', () => {
    const result = average([1, 2, 3, 4, 5]);
    expect(result).toBe(3);
  });

  it('calculates average of single number', () => {
    const result = average([42]);
    expect(result).toBe(42);
  });

  it('calculates average with decimals', () => {
    const result = average([1, 2, 3]);
    expect(result).toBe(2);
  });

  it('calculates average with negative numbers', () => {
    const result = average([-1, 0, 1]);
    expect(result).toBe(0);
  });

  it('calculates average of decimal results', () => {
    const result = average([1, 2, 4]);
    expect(result).toBeCloseTo(2.333, 3);
  });

  it('returns NaN for empty array', () => {
    const result = average([]);
    expect(result).toBeNaN();
  });

  it('works with Set of numbers', () => {
    const result = average(new Set([2, 4, 6]));
    expect(result).toBe(4);
  });

  it('works with generator', () => {
    function* numbers() {
      yield 10;
      yield 20;
      yield 30;
    }
    const result = average(numbers());
    expect(result).toBe(20);
  });

  it('handles large numbers', () => {
    const result = average([1e6, 2e6, 3e6]);
    expect(result).toBe(2e6);
  });

  it('handles floating point precision', () => {
    const result = average([0.1, 0.2, 0.3]);
    expect(result).toBeCloseTo(0.2, 10);
  });
});