import { describe, it, expect } from 'vitest';
import { find } from '../src/find';

describe('find', () => {
  it('finds first matching element', () => {
    const result = find([1, 2, 3, 4, 5], x => x > 3);
    expect(result).toBe(4);
  });

  it('returns null when no element matches', () => {
    const result = find([1, 2, 3], x => x > 10);
    expect(result).toBe(null);
  });

  it('finds with index parameter', () => {
    const result = find(['a', 'b', 'c'], (item, index) => index === 1);
    expect(result).toBe('b');
  });

  it('works in curried form', () => {
    const findEven = find((x: number) => x % 2 === 0);
    const result = findEven([1, 3, 4, 5]);
    expect(result).toBe(4);
  });

  it('finds first element in empty array returns null', () => {
    const result = find([], () => true);
    expect(result).toBe(null);
  });

  it('finds character in string', () => {
    const result = find('hello', char => char === 'l');
    expect(result).toBe('l');
  });

  it('finds element in Set', () => {
    const result = find(new Set([1, 2, 3]), x => x > 2);
    expect(result).toBe(3);
  });

  it('finds first truthy element', () => {
    const result = find([0, false, '', 'hello', 42], x => !!x);
    expect(result).toBe('hello');
  });

  it('stops at first match', () => {
    let callCount = 0;
    const result = find([1, 2, 3, 4, 5], x => {
      callCount++;
      return x === 3;
    });
    expect(result).toBe(3);
    expect(callCount).toBe(3); // Should stop after finding 3
  });
});