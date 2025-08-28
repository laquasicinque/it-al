import { describe, it, expect } from 'vitest';
import { cycle } from '../src/cycle';

describe('cycle', () => {
  it('cycles through array elements infinitely', () => {
    const cycled = cycle([1, 2, 3]);
    const result = [];
    const iterator = cycled[Symbol.iterator]();
    
    for (let i = 0; i < 7; i++) {
      result.push(iterator.next().value);
    }
    
    expect(result).toEqual([1, 2, 3, 1, 2, 3, 1]);
  });

  it('cycles through single element', () => {
    const cycled = cycle([42]);
    const result = [];
    const iterator = cycled[Symbol.iterator]();
    
    for (let i = 0; i < 5; i++) {
      result.push(iterator.next().value);
    }
    
    expect(result).toEqual([42, 42, 42, 42, 42]);
  });

  it('cycles through string characters', () => {
    const cycled = cycle('abc');
    const result = [];
    const iterator = cycled[Symbol.iterator]();
    
    for (let i = 0; i < 8; i++) {
      result.push(iterator.next().value);
    }
    
    expect(result).toEqual(['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b']);
  });

  it('handles empty iterable', () => {
    const cycled = cycle([]);
    const iterator = cycled[Symbol.iterator]();
    const result = iterator.next();
    
    expect(result.done).toBe(true);
    expect(result.value).toBeUndefined();
  });

  it('works with Set', () => {
    const cycled = cycle(new Set([1, 2]));
    const result = [];
    const iterator = cycled[Symbol.iterator]();
    
    for (let i = 0; i < 6; i++) {
      result.push(iterator.next().value);
    }
    
    expect(result).toEqual([1, 2, 1, 2, 1, 2]);
  });

  it('works with generator (caches values)', () => {
    function* gen() {
      yield 'x';
      yield 'y';
    }
    
    const cycled = cycle(gen());
    const result = [];
    const iterator = cycled[Symbol.iterator]();
    
    for (let i = 0; i < 5; i++) {
      result.push(iterator.next().value);
    }
    
    expect(result).toEqual(['x', 'y', 'x', 'y', 'x']);
  });

  it('cycles mixed types', () => {
    const cycled = cycle([1, 'hello', true]);
    const result = [];
    const iterator = cycled[Symbol.iterator]();
    
    for (let i = 0; i < 7; i++) {
      result.push(iterator.next().value);
    }
    
    expect(result).toEqual([1, 'hello', true, 1, 'hello', true, 1]);
  });


  it('handles objects in cycle', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const cycled = cycle([obj1, obj2]);
    const result = [];
    const iterator = cycled[Symbol.iterator]();
    
    for (let i = 0; i < 4; i++) {
      result.push(iterator.next().value);
    }
    
    expect(result).toEqual([obj1, obj2, obj1, obj2]);
  });
});