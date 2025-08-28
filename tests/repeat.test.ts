import { describe, it, expect } from 'vitest';
import { repeat } from '../src/repeat';

describe('repeat', () => {
  it('repeats array multiple times', () => {
    const result = [...repeat([1, 2], 3)];
    expect(result).toEqual([1, 2, 1, 2, 1, 2]);
  });

  it('repeats single element array', () => {
    const result = [...repeat([42], 4)];
    expect(result).toEqual([42, 42, 42, 42]);
  });

  it('repeats empty array', () => {
    const result = [...repeat([], 3)];
    expect(result).toEqual([]);
  });

  it('repeats string characters', () => {
    const result = [...repeat('ab', 3)];
    expect(result).toEqual(['a', 'b', 'a', 'b', 'a', 'b']);
  });

  it('works in curried form', () => {
    const repeatThree = repeat(3);
    const result = [...repeatThree([1, 2])];
    expect(result).toEqual([1, 2, 1, 2, 1, 2]);
  });

  it('repeats zero times returns empty', () => {
    const result = [...repeat([1, 2, 3], 0)];
    expect(result).toEqual([]);
  });

  it('repeats once returns original', () => {
    const result = [...repeat([1, 2, 3], 1)];
    expect(result).toEqual([1, 2, 3]);
  });

  it('works with Set', () => {
    const result = [...repeat(new Set([1, 2]), 2)];
    expect(result).toEqual([1, 2, 1, 2]);
  });

  it('works with generator (caches values)', () => {
    function* gen() {
      yield 1;
      yield 2;
    }
    const result = [...repeat(gen(), 3)];
    expect(result).toEqual([1, 2, 1, 2, 1, 2]);
  });

  it('handles mixed types', () => {
    const result = [...repeat([1, 'hello', true], 2)];
    expect(result).toEqual([1, 'hello', true, 1, 'hello', true]);
  });

  it('handles negative times as zero', () => {
    const result = [...repeat([1, 2], -1)];
    expect(result).toEqual([]);
  });
});