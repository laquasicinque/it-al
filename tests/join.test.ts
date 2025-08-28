import { describe, it, expect } from 'vitest';
import { join } from '../src/join';

describe('join', () => {
  it('joins array elements with default comma', () => {
    const result = join(['a', 'b', 'c']);
    expect(result).toBe('a,b,c');
  });

  it('joins array elements with custom delimiter', () => {
    const result = join(['apple', 'banana', 'cherry'], ' | ');
    expect(result).toBe('apple | banana | cherry');
  });

  it('joins numbers', () => {
    const result = join([1, 2, 3, 4], '-');
    expect(result).toBe('1-2-3-4');
  });

  it('joins empty array', () => {
    const result = join([], '-');
    expect(result).toBe('');
  });

  it('joins single element', () => {
    const result = join(['only'], '-');
    expect(result).toBe('only');
  });

  it('joins with empty string delimiter', () => {
    const result = join(['a', 'b', 'c'], '');
    expect(result).toBe('abc');
  });

  it('joins string characters', () => {
    const result = join('-')('hello');
    expect(result).toBe('h-e-l-l-o');
  });

  it('joins Set elements', () => {
    const result = join(new Set(['x', 'y', 'z']), '');
    expect(result).toBe('xyz');
  });

  it('joins mixed types', () => {
    const result = join([1, 'hello', true, null], ' ');
    expect(result).toBe('1 hello true '); // null becomes empty string in Array.join()
  });

  it('joins with space delimiter', () => {
    const result = join(['Hello', 'World'], ' ');
    expect(result).toBe('Hello World');
  });
});