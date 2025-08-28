import { describe, it, expect } from 'vitest';
import { includes } from '../src/includes';

describe('includes', () => {
  it('returns true when element is found', () => {
    const result = includes([1, 2, 3, 4, 5], 3);
    expect(result).toBe(true);
  });

  it('returns false when element is not found', () => {
    const result = includes([1, 2, 3, 4, 5], 6);
    expect(result).toBe(false);
  });

  it('returns false for empty array', () => {
    const result = includes([], 1);
    expect(result).toBe(false);
  });

  it('works in curried form', () => {
    const includesThree = includes(3);
    const result = includesThree([1, 2, 3, 4, 5]);
    expect(result).toBe(true);
  });

  it('finds strings', () => {
    const result = includes(['apple', 'banana', 'cherry'], 'banana');
    expect(result).toBe(true);
  });

  it('finds characters in string', () => {
    const result = includes('hello', 'l');
    expect(result).toBe(true);
  });

  it('handles falsy values', () => {
    const result = includes([0, false, null, undefined], null);
    expect(result).toBe(true);
  });

  it('works with Set elements', () => {
    const result = includes(new Set([1, 2, 3]), 2);
    expect(result).toBe(true);
  });

  it('uses Object.is equality', () => {
    const result = includes([1, 2, 3], '2');
    expect(result).toBe(false);
  });

  it('finds objects by reference', () => {
    const obj = { a: 1 };
    const result = includes([obj, { b: 2 }], obj);
    expect(result).toBe(true);
  });

  it('does not find objects by value', () => {
    const result = includes([{ a: 1 }], { a: 1 });
    expect(result).toBe(false);
  });

  it('handles NaN correctly with Object.is', () => {
    const result = includes([1, NaN, 3], NaN);
    expect(result).toBe(true); // Object.is(NaN, NaN) === true
  });
});