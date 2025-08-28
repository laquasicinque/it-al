import { describe, it, expect } from 'vitest';
import { pluck } from '../src/pluck';

describe('pluck', () => {
  it('plucks property values from objects', () => {
    const data = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 }
    ];
    const result = [...pluck(data, 'name')];
    expect(result).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('works in curried form', () => {
    const pluckName = pluck('name');
    const data = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 }
    ];
    const result = [...pluckName(data)];
    expect(result).toEqual(['Alice', 'Bob']);
  });

  it('handles missing properties', () => {
    const data = [
      { name: 'Alice', age: 30 },
      { name: 'Bob' },
      { age: 25 }
    ];
    const result = [...pluck(data, 'age')];
    expect(result).toEqual([30, undefined, 25]);
  });

  it('plucks numeric indices from arrays', () => {
    const data = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ];
    const result = [...pluck(data, 1)];
    expect(result).toEqual([2, 5, 8]);
  });

  it('works with mixed data types', () => {
    const data = [
      { value: 'string' },
      { value: 42 },
      { value: true },
      { value: null }
    ];
    const result = [...pluck(data, 'value')];
    expect(result).toEqual(['string', 42, true, null]);
  });

  it('handles empty array', () => {
    const result = [...pluck([], 'key')];
    expect(result).toEqual([]);
  });

  it('works with nested objects', () => {
    const data = [
      { user: { name: 'Alice' } },
      { user: { name: 'Bob' } },
      { user: null }
    ];
    const result = [...pluck(data, 'user')];
    expect(result).toEqual([{ name: 'Alice' }, { name: 'Bob' }, null]);
  });

  it('plucks from Set of objects', () => {
    const data = new Set([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]);
    const result = [...pluck(data, 'id')];
    expect(result).toEqual([1, 2]);
  });

  it('handles symbol keys', () => {
    const sym = Symbol('test');
    const data = [
      { [sym]: 'value1' },
      { [sym]: 'value2' }
    ];
    const result = [...pluck(data, sym)];
    expect(result).toEqual(['value1', 'value2']);
  });

  it('handles string keys with numbers', () => {
    const data = [
      { '0': 'first', '1': 'second' },
      { '0': 'third', '1': 'fourth' }
    ];
    const result = [...pluck(data, '0')];
    expect(result).toEqual(['first', 'third']);
  });
});