import { describe, it, expect } from 'vitest';
import { chunk } from '../src/chunk';

describe('chunk', () => {
  it('chunks array into specified sizes', () => {
    const result = [...chunk([1, 2, 3, 4, 5], 2)];
    expect(result).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('chunks exact divisions', () => {
    const result = [...chunk([1, 2, 3, 4], 2)];
    expect(result).toEqual([[1, 2], [3, 4]]);
  });

  it('works in curried form', () => {
    const chunkBy3 = chunk(3);
    const result = [...chunkBy3([1, 2, 3, 4, 5, 6, 7])];
    expect(result).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  });

  it('chunks empty array', () => {
    const result = [...chunk([], 2)];
    expect(result).toEqual([]);
  });

  it('chunks single element', () => {
    const result = [...chunk([1], 3)];
    expect(result).toEqual([[1]]);
  });

  it('chunks with size 1', () => {
    const result = [...chunk([1, 2, 3], 1)];
    expect(result).toEqual([[1], [2], [3]]);
  });

  it('chunks string characters', () => {
    const result = [...chunk('abcdef', 2)];
    expect(result).toEqual([['a', 'b'], ['c', 'd'], ['e', 'f']]);
  });

  it('chunks large size returns single chunk', () => {
    const result = [...chunk([1, 2, 3], 10)];
    expect(result).toEqual([[1, 2, 3]]);
  });
});