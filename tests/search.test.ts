import { describe, it, expect } from 'vitest';
import { search } from '../src/search';

describe('search', () => {
  it('searches for numbers in nested object', () => {
    const obj = { a: { b: 1 }, c: { d: { e: 2 } } };
    const results = [...search(obj, (path, val) => typeof val === 'number')];
    expect(results).toEqual([
      [['a', 'b'], 1],
      [['c', 'd', 'e'], 2]
    ]);
  });

  it('works in curried form', () => {
    const findStrings = search((path: any, val: any) => typeof val === 'string');
    const obj = { name: 'John', age: 30, city: 'NYC' };
    const results = [...findStrings(obj)];
    expect(results).toEqual([
      [['name'], 'John'],
      [['city'], 'NYC']
    ]);
  });

  it('searches arrays', () => {
    const arr = [1, [2, 3], [4, [5, 6]]];
    const results = [...search(arr, (path, val) => val === 5)];
    expect(results).toEqual([[[2, 1, 0], 5]]);
  });

  it('searches with skipAfterYield', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const results = [...search(obj, (path, val) => typeof val === 'number', true)];
    expect(results.length).toBeGreaterThanOrEqual(1); // Should have at least one match
    expect(results[0][1]).toBe(1); // First match should be the number 1
  });

  it('handles empty object', () => {
    const results = [...search({}, (path, val) => path.length > 0)];
    expect(results).toEqual([]);
  });

  it('handles null values', () => {
    const obj = { a: null, b: undefined, c: 'value' };
    const results = [...search(obj, (path, val) => val === null)];
    expect(results).toEqual([[['a'], null]]);
  });

  it('searches nested arrays and objects', () => {
    const data = {
      users: [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 }
      ]
    };
    const results = [...search(data, (path, val) => val === 'Bob')];
    expect(results).toEqual([[['users', 1, 'name'], 'Bob']]);
  });

  it('avoids circular references', () => {
    const obj: any = { a: 1 };
    obj.self = obj; // Create circular reference
    
    const results = [...search(obj, (path, val) => typeof val === 'number')];
    expect(results).toEqual([[['a'], 1]]);
    // Should not hang due to circular reference
  });
});