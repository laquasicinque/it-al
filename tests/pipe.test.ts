import { describe, it, expect } from 'vitest';
import { pipe } from '../src/pipe';

describe('pipe', () => {
  it('pipes value through single function', () => {
    const result = pipe([x => x * 2])(5);
    expect(result).toBe(10);
  });

  it('pipes value through multiple functions', () => {
    const result = pipe([
      x => x * 2,    // 10
      x => x + 3,    // 13
      x => x.toString() // "13"
    ])(5);
    expect(result).toBe("13");
  });

  it('pipes through array transformation', () => {
    const result = pipe([
      arr => arr.filter(x => x % 2 === 0),  // [2, 4]
      arr => arr.map(x => x * 2),           // [4, 8]
      arr => arr.reduce((a, b) => a + b, 0) // 12
    ])([1, 2, 3, 4, 5]);
    expect(result).toBe(12);
  });

  it('handles complex object transformations', () => {
    const user = { name: 'Alice', age: 30 };
    const result = pipe([
      u => ({ ...u, age: u.age + 1 }),
      u => ({ ...u, name: u.name.toUpperCase() }),
      u => `${u.name} is ${u.age} years old`
    ])(user);
    expect(result).toBe("ALICE is 31 years old");
  });

  it('works with empty function array', () => {
    const result = pipe([])(42);
    expect(result).toBe(42);
  });

  it('preserves type through transformations', () => {
    const result = pipe([
      s => s.toUpperCase(),
      s => s.split(''),
      arr => arr.join('-')
    ])("hello");
    expect(result).toBe("H-E-L-L-O");
  });

  it('handles null and undefined', () => {
    const result1 = pipe([x => x || 'default'])(null);
    expect(result1).toBe('default');
    
    const result2 = pipe([x => x ?? 'fallback'])(undefined);
    expect(result2).toBe('fallback');
  });

  it('can create reusable pipelines', () => {
    const transform = pipe([
      x => x * 2,
      x => x + 1,
      x => Math.sqrt(x)
    ]);
    
    expect(transform(4)).toBe(3); // sqrt(4*2+1) = sqrt(9) = 3
    expect(transform(8)).toBe(Math.sqrt(17)); // sqrt(8*2+1) = sqrt(17)
  });

  it('handles functions returning promises', () => {
    const result = pipe([
      x => Promise.resolve(x * 2)
    ])(5);
    expect(result).toBeInstanceOf(Promise);
  });

  it('works with boolean logic', () => {
    const result = pipe([
      x => x > 5,     // true
      bool => !bool,  // false
      bool => bool ? 'yes' : 'no' // 'no'
    ])(10);
    expect(result).toBe('no');
  });
});