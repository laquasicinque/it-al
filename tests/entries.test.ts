import { describe, it, expect } from 'vitest';
import { entries } from '../src/entries';

describe('entries', () => {
  it('gets entries from object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = [...entries(obj)];
    expect(result).toEqual([['a', 1], ['b', 2], ['c', 3]]);
  });

  it('handles empty object', () => {
    const result = [...entries({})];
    expect(result).toEqual([]);
  });

  it('handles object with different value types', () => {
    const obj = {
      name: 'Alice',
      age: 30,
      active: true,
      data: null
    };
    const result = [...entries(obj)];
    expect(result).toEqual([
      ['name', 'Alice'],
      ['age', 30],
      ['active', true],
      ['data', null]
    ]);
  });

  it('does not include inherited properties', () => {
    const parent = { inherited: 'value' };
    const child = Object.create(parent);
    child.own = 'property';
    
    const result = [...entries(child)];
    expect(result).toEqual([['own', 'property']]);
  });

  it('handles object with symbol keys', () => {
    const sym = Symbol('test');
    const obj = { [sym]: 'symbol value', regular: 'regular value' };
    const result = [...entries(obj)];
    expect(result).toEqual([['regular', 'regular value']]);
  });

  it('handles array as object', () => {
    const arr = ['a', 'b', 'c'];
    const result = [...entries(arr)];
    expect(result).toEqual([[0, 'a'], [1, 'b'], [2, 'c']]);
  });

  it('handles object with numeric keys', () => {
    const obj = { 0: 'zero', 1: 'one', 2: 'two' };
    const result = [...entries(obj)];
    expect(result).toEqual([['0', 'zero'], ['1', 'one'], ['2', 'two']]);
  });

  it('handles object with undefined values', () => {
    const obj = { a: undefined, b: null, c: 0 };
    const result = [...entries(obj)];
    expect(result).toEqual([['a', undefined], ['b', null], ['c', 0]]);
  });

  it('handles nested objects', () => {
    const obj = {
      user: { name: 'Alice' },
      settings: { theme: 'dark' }
    };
    const result = [...entries(obj)];
    expect(result).toEqual([
      ['user', { name: 'Alice' }],
      ['settings', { theme: 'dark' }]
    ]);
  });
});