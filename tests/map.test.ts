import { describe, it, expect } from 'vitest';
import { map } from '../src/map';

describe('map', () => {
  it('maps array elements with function', () => {
    const result = [...map([1, 2, 3], x => x * 2)];
    expect(result).toEqual([2, 4, 6]);
  });

  it('maps with index parameter', () => {
    const result = [...map(['a', 'b', 'c'], (item, index) => `${index}:${item}`)];
    expect(result).toEqual(['0:a', '1:b', '2:c']);
  });

  it('works in curried form', () => {
    const double = map((x: number) => x * 2);
    const result = [...double([1, 2, 3])];
    expect(result).toEqual([2, 4, 6]);
  });

  it('maps empty array', () => {
    const result = [...map([], x => x)];
    expect(result).toEqual([]);
  });

  it('maps string characters', () => {
    const result = [...map('abc', char => char.toUpperCase())];
    expect(result).toEqual(['A', 'B', 'C']);
  });

  it('maps Set elements', () => {
    const result = [...map(new Set([1, 2, 3]), x => x * 10)];
    expect(result).toEqual([10, 20, 30]);
  });

  it('maps generator values', () => {
    function* gen() {
      yield 1;
      yield 2;
      yield 3;
    }
    const result = [...map(gen(), x => x + 100)];
    expect(result).toEqual([101, 102, 103]);
  });
});