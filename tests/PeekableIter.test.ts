import { describe, it, expect } from "vitest";
import { PeekableIter } from "../src";

describe("PeekableIter", () => {
  it("should extend Iter functionality with peek", () => {
    const arr = [1, 2, 3, 4, 5];
    const iter = new PeekableIter(arr);

    expect(iter.peek()).toBe(1);
    expect(iter.peek()).toBe(1);

    const mapped = iter.map(x => x * 2);
    expect([...mapped]).toEqual([2, 4, 6, 8, 10]);
  });

  it("should allow chaining with other Iter methods", () => {
    const arr = [1, 2, 3, 4, 5, 6];
    const iter = new PeekableIter(arr);

    expect(iter.peek()).toBe(1);

    const result = iter
      .filter(x => x % 2 === 0)
      .map(x => x * 10)
      .toArray();

    expect(result).toEqual([20, 40, 60]);
  });

  it("should work with empty arrays", () => {
    const iter = new PeekableIter([]);
    expect(iter.peek()).toBeUndefined();
    expect(iter.toArray()).toEqual([]);
  });

  it("should maintain peek functionality after chaining", () => {
    const arr = [1, 2, 3, 4, 5];
    const iter = new PeekableIter(arr);

    const filtered = iter.filter(x => x > 2);
    expect(iter.peek()).toBe(1);

    expect(filtered.toArray()).toEqual([3, 4, 5]);
  });

  it("should work with generators", () => {
    function* fibonacci() {
      let a = 0,
        b = 1;
      while (true) {
        yield a;
        [a, b] = [b, a + b];
      }
    }

    const iter = new PeekableIter(fibonacci());
    expect(iter.peek()).toBe(0);

    const first10 = iter.take(10).toArray();
    expect(first10).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
  });

  it("should handle peek with string iterables", () => {
    const iter = new PeekableIter("hello");
    expect(iter.peek()).toBe("h");

    const result = iter.toArray();
    expect(result).toEqual(["h", "e", "l", "l", "o"]);
  });

  it("should work with Set", () => {
    const set = new Set([1, 2, 3]);
    const iter = new PeekableIter(set);

    expect(iter.peek()).toBe(1);
    expect(iter.toArray()).toEqual([1, 2, 3]);
  });

  it("should work with Map", () => {
    const map = new Map([
      ["a", 1],
      ["b", 2],
    ]);
    const iter = new PeekableIter(map);

    expect(iter.peek()).toEqual(["a", 1]);
    expect(iter.toArray()).toEqual([
      ["a", 1],
      ["b", 2],
    ]);
  });

  it("works with static methods", async () => {
    expect(PeekableIter.from([1, 2, 3])).toBeInstanceOf(PeekableIter);
    expect(await PeekableIter.fromAsync([1, 2, 3])).toBeInstanceOf(
      PeekableIter
    );
    expect(PeekableIter.fromRange(10, 1, 1)).toBeInstanceOf(PeekableIter);
    expect(PeekableIter.gen(() => 1)).toBeInstanceOf(PeekableIter);
    expect(PeekableIter.search({}, () => 1)).toBeInstanceOf(PeekableIter);
    expect(PeekableIter.zip([])).toBeInstanceOf(PeekableIter);
  });
});
