import { describe, it, expect } from 'vitest';
import { takeWhile } from '../src/takeWhile';

describe('takeWhile', () => {
  it('takes elements while predicate is true', () => {
    const result = [...takeWhile([1, 2, 3, 4, 5], x => x < 4)];
    expect(result).toEqual([1, 2, 3]);
  });

  it('stops at first false predicate', () => {
    const result = [...takeWhile([2, 4, 5, 6, 8], x => x % 2 === 0)];
    expect(result).toEqual([2, 4]);
  });

  it('uses index parameter', () => {
    const result = [...takeWhile(['a', 'b', 'c', 'd'], (item, index) => index < 2)];
    expect(result).toEqual(['a', 'b']);
  });

  it('works in curried form', () => {
    const takeWhileSmall = takeWhile((x: number) => x < 3);
    const result = [...takeWhileSmall([1, 2, 3, 4])];
    expect(result).toEqual([1, 2]);
  });

  it('takes all elements if all match', () => {
    const result = [...takeWhile([1, 2, 3], x => x < 10)];
    expect(result).toEqual([1, 2, 3]);
  });

  it('takes no elements if first fails', () => {
    const result = [...takeWhile([5, 1, 2, 3], x => x < 3)];
    expect(result).toEqual([]);
  });

  it('takes from empty array', () => {
    const result = [...takeWhile([], () => true)];
    expect(result).toEqual([]);
  });

  it('works with string characters', () => {
    const result = [...takeWhile('hello', char => char !== 'l')];
    expect(result).toEqual(['h', 'e']);
  });

  it('works with Set elements', () => {
    const result = [...takeWhile(new Set([1, 2, 3, 4]), x => x < 3)];
    expect(result).toEqual([1, 2]);
  });
});