import { describe, it, expect } from 'vitest';
import { tap } from '../src/tap';

describe('tap', () => {
  it('performs side effects without changing values', () => {
    const sideEffects: number[] = [];
    const result = [...tap([1, 2, 3], x => sideEffects.push(x * 2))];
    
    expect(result).toEqual([1, 2, 3]); // Original values unchanged
    expect(sideEffects).toEqual([2, 4, 6]); // Side effects captured
  });

  it('works in curried form', () => {
    const logger: string[] = [];
    const logAndDouble = tap((x: number) => logger.push(`Processing: ${x}`));
    
    const result = [...logAndDouble([5, 10])];
    expect(result).toEqual([5, 10]);
    expect(logger).toEqual(['Processing: 5', 'Processing: 10']);
  });

  it('passes index to tap function', () => {
    const logs: Array<[string, number]> = [];
    const result = [...tap(['a', 'b', 'c'], (item, index) => logs.push([item, index]))];
    
    expect(result).toEqual(['a', 'b', 'c']);
    expect(logs).toEqual([['a', 0], ['b', 1], ['c', 2]]);
  });

  it('works with empty iterable', () => {
    let called = false;
    const result = [...tap([], () => { called = true; })];
    
    expect(result).toEqual([]);
    expect(called).toBe(false);
  });

  it('can be used for debugging in chains', () => {
    const debugLog: number[] = [];
    
    const result = [1, 2, 3, 4, 5]
      .map(x => x * 2)
      .filter(x => [...tap([x], val => debugLog.push(val))][0] > 4)
      .map(x => x + 1);
    
    expect(result).toEqual([7, 9, 11]);
    expect(debugLog).toEqual([2, 4, 6, 8, 10]);
  });

  it('handles errors in tap function gracefully', () => {
    // The error should propagate when the iterator is consumed
    expect(() => {
      [...tap([1, 2, 3], x => {
        if (x === 2) throw new Error('Test error');
      })];
    }).toThrow('Test error');
  });
});