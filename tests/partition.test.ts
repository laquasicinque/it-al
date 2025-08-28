import { describe, it, expect } from 'vitest';
import { partition } from '../src/partition';

describe('partition', () => {
  it('partitions numbers by even/odd', () => {
    const [passed, failed] = partition([1, 2, 3, 4, 5], x => x % 2 === 0);
    expect(passed).toEqual([2, 4]);
    expect(failed).toEqual([1, 3, 5]);
  });

  it('partitions with index parameter', () => {
    const [passed, failed] = partition(['a', 'b', 'c', 'd'], (item, index) => index % 2 === 0);
    expect(passed).toEqual(['a', 'c']);
    expect(failed).toEqual(['b', 'd']);
  });

  it('works in curried form', () => {
    const partitionByLength = partition((str: string) => str.length > 3);
    const [long, short] = partitionByLength(['hi', 'hello', 'bye', 'world']);
    expect(long).toEqual(['hello', 'world']);
    expect(short).toEqual(['hi', 'bye']);
  });

  it('partitions empty array', () => {
    const [passed, failed] = partition([], () => true);
    expect(passed).toEqual([]);
    expect(failed).toEqual([]);
  });

  it('all elements pass', () => {
    const [passed, failed] = partition([2, 4, 6], x => x % 2 === 0);
    expect(passed).toEqual([2, 4, 6]);
    expect(failed).toEqual([]);
  });

  it('all elements fail', () => {
    const [passed, failed] = partition([1, 3, 5], x => x % 2 === 0);
    expect(passed).toEqual([]);
    expect(failed).toEqual([1, 3, 5]);
  });

  it('partitions string characters', () => {
    const [vowels, consonants] = partition('hello', char => 'aeiou'.includes(char));
    expect(vowels).toEqual(['e', 'o']);
    expect(consonants).toEqual(['h', 'l', 'l']);
  });

  it('works with type guards', () => {
    const mixed: (string | number)[] = ['a', 1, 'b', 2, 'c', 3];
    const [strings, notStrings] = partition(mixed, (x): x is string => typeof x === 'string');
    expect(strings).toEqual(['a', 'b', 'c']);
    expect(notStrings).toEqual([1, 2, 3]);
  });
});