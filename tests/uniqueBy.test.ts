import { describe, it, expect } from 'vitest';
import { uniqueBy } from '../src/uniqueBy';

describe('uniqueBy', () => {
  it('removes duplicates based on function result', () => {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 1, name: 'Alice Clone' },
      { id: 3, name: 'Charlie' }
    ];
    const result = [...uniqueBy(data, item => item.id)];
    expect(result).toHaveLength(3);
    expect(result.map(x => x.id)).toEqual([1, 2, 3]);
    expect(result[0].name).toBe('Alice'); // First occurrence kept
  });

  it('works in curried form', () => {
    const uniqueById = uniqueBy((item: { id: number }) => item.id);
    const data = [{ id: 1 }, { id: 2 }, { id: 1 }, { id: 3 }];
    const result = [...uniqueById(data)];
    expect(result).toHaveLength(3);
  });

  it('uses index parameter', () => {
    const result = [...uniqueBy(['a', 'b', 'c', 'a'], (item, index) => index % 2)];
    expect(result).toHaveLength(2); // One for even index, one for odd index
  });

  it('works with primitive values', () => {
    const result = [...uniqueBy([1, 2, 1, 3, 2, 4], x => x)];
    expect(result).toEqual([1, 2, 3, 4]);
  });

  it('works with string transformation', () => {
    const result = [...uniqueBy(['Alice', 'bob', 'CHARLIE', 'alice'], name => name.toLowerCase())];
    expect(result).toHaveLength(3);
    expect(result.map(x => x.toLowerCase())).toEqual(['alice', 'bob', 'charlie']);
    expect(result[0]).toBe('Alice'); // First occurrence kept
  });

  it('handles empty array', () => {
    const result = [...uniqueBy([], (x: any) => x)];
    expect(result).toEqual([]);
  });

  it('works with complex key functions', () => {
    const data = [
      { x: 1, y: 2 },
      { x: 2, y: 1 },
      { x: 1, y: 2 }, // duplicate
      { x: 3, y: 1 }
    ];
    const result = [...uniqueBy(data, item => `${item.x},${item.y}`)];
    expect(result).toHaveLength(3);
  });

  it('preserves original object references', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 1 }; // different object, same id
    const result = [...uniqueBy([obj1, obj2, obj3], x => x.id)];
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(obj1); // Same reference
    expect(result[1]).toBe(obj2);
  });

  it('works with null and undefined keys', () => {
    const data = [1, null, 2, undefined, null, 3];
    const result = [...uniqueBy(data, x => x)];
    expect(result).toEqual([1, null, 2, undefined, 3]);
  });
});