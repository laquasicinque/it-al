import { describe, it, expect } from 'vitest';
import { isEmpty } from '../src/isEmpty';

describe('isEmpty', () => {
  it('returns true for empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('returns false for non-empty array', () => {
    expect(isEmpty([1, 2, 3])).toBe(false);
  });

  it('returns true for empty Set', () => {
    expect(isEmpty(new Set())).toBe(true);
  });

  it('returns false for non-empty Set', () => {
    expect(isEmpty(new Set([1, 2, 3]))).toBe(false);
  });

  it('returns true for empty Map', () => {
    expect(isEmpty(new Map())).toBe(true);
  });

  it('returns false for non-empty Map', () => {
    expect(isEmpty(new Map([['a', 1]]))).toBe(false);
  });

  it('returns true for empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('returns false for non-empty string', () => {
    expect(isEmpty('hello')).toBe(false);
  });

  it('returns true for empty generator', () => {
    function* gen() {
      // Empty generator
    }
    expect(isEmpty(gen())).toBe(true);
  });

  it('returns false for non-empty generator', () => {
    function* gen() {
      yield 1;
    }
    expect(isEmpty(gen())).toBe(false);
  });
});