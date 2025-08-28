import { describe, it, expect } from 'vitest';
import { gen } from '../src/gen';

describe('gen', () => {
  it('creates generator from function', () => {
    let counter = 0;
    const generatorFn = gen(() => counter++);
    const generator = generatorFn();
    const iterator = generator[Symbol.iterator]();
    
    expect(iterator.next().value).toBe(0);
    expect(iterator.next().value).toBe(1);
    expect(iterator.next().value).toBe(2);
  });

  it('creates infinite sequence', () => {
    const evensFn = gen((n: number) => n * 2);
    const evens = evensFn();
    const first5 = [];
    const iterator = evens[Symbol.iterator]();
    
    for (let i = 0; i < 5; i++) {
      first5.push(iterator.next().value);
    }
    
    expect(first5).toEqual([0, 2, 4, 6, 8]); // n starts at 0 and increments
  });

  it('creates iterable generator function', () => {
    const randomFn = gen(() => Math.random());
    const generator = randomFn();
    
    // Test that it creates an iterable
    const iterator = generator[Symbol.iterator]();
    expect(typeof iterator.next).toBe('function');
    
    const value1 = iterator.next().value;
    const value2 = iterator.next().value;
    expect(typeof value1).toBe('number');
    expect(typeof value2).toBe('number');
  });

  it('works with constant values', () => {
    const constantFn = gen(() => 42);
    const constant = constantFn();
    const iterator = constant[Symbol.iterator]();
    
    expect(iterator.next().value).toBe(42);
    expect(iterator.next().value).toBe(42);
    expect(iterator.next().value).toBe(42);
  });

  it('can generate random numbers', () => {
    const randomFn = gen(() => Math.random());
    const random = randomFn();
    const iterator = random[Symbol.iterator]();
    
    const val1 = iterator.next().value;
    const val2 = iterator.next().value;
    
    expect(typeof val1).toBe('number');
    expect(typeof val2).toBe('number');
    expect(val1).toBeGreaterThanOrEqual(0);
    expect(val1).toBeLessThan(1);
  });

  it('preserves generator state', () => {
    let state = 0;
    const statefulFn = gen(() => ++state);
    const stateful = statefulFn();
    const iterator = stateful[Symbol.iterator]();
    
    expect(iterator.next().value).toBe(1);
    expect(iterator.next().value).toBe(2);
    expect(iterator.next().value).toBe(3);
  });
});