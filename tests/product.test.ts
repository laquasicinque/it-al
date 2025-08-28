import { describe, it, expect } from 'vitest';
import { product } from '../src/product';

describe('product', () => {
  it('multiplies array of numbers', () => {
    const result = product([2, 3, 4]);
    expect(result).toBe(24);
  });

  it('multiplies empty array to one', () => {
    const result = product([]);
    expect(result).toBe(1);
  });

  it('multiplies single element', () => {
    const result = product([7]);
    expect(result).toBe(7);
  });

  it('multiplies with zero results in zero', () => {
    const result = product([1, 2, 0, 4]);
    expect(result).toBe(0);
  });

  it('multiplies negative numbers', () => {
    const result = product([-2, -3]);
    expect(result).toBe(6);
  });

  it('multiplies odd number of negatives', () => {
    const result = product([-2, -3, -1]);
    expect(result).toBe(-6);
  });

  it('multiplies decimal numbers', () => {
    const result = product([2.5, 4]);
    expect(result).toBe(10);
  });

  it('multiplies Set of numbers', () => {
    const result = product(new Set([2, 3, 4]));
    expect(result).toBe(24);
  });

  it('multiplies generator values', () => {
    function* numbers() {
      yield 2;
      yield 3;
      yield 4;
    }
    const result = product(numbers());
    expect(result).toBe(24);
  });

  it('handles fractional results', () => {
    const result = product([0.5, 0.5]);
    expect(result).toBe(0.25);
  });

  it('handles one values', () => {
    const result = product([1, 1, 1, 5]);
    expect(result).toBe(5);
  });
});