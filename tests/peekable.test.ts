import { describe, it, expect } from "vitest";
import { peekable } from "../src/peekable";

describe("peekable", () => {
  it("should allow peeking at the next value without consuming it", () => {
    const arr = [1, 2, 3];
    const p = peekable(arr);

    expect(p.peek()).toBe(1);
    expect(p.peek()).toBe(1);

    const result = [...p];
    expect(result).toEqual([1, 2, 3]);
  });

  it("should work with empty iterables", () => {
    const p = peekable([]);
    expect(p.peek()).toBeUndefined();
    expect([...p]).toEqual([]);
  });

  it("should handle single element iterables", () => {
    const p = peekable([42]);
    expect(p.peek()).toBe(42);
    expect([...p]).toEqual([42]);
  });

  it("should maintain correct iteration order after peek", () => {
    const arr = [1, 2, 3, 4, 5];
    const p = peekable(arr);

    expect(p.peek()).toBe(1);

    const iterator = p[Symbol.iterator]();
    expect(iterator.next().value).toBe(1);
    expect(iterator.next().value).toBe(2);

    expect(p.peek()).toBe(3);
    expect(iterator.next().value).toBe(3);
    expect(iterator.next().value).toBe(4);
    expect(iterator.next().value).toBe(5);
    expect(iterator.next().done).toBe(true);
  });

  it("should handle multiple peeks before iteration", () => {
    const arr = ["a", "b", "c"];
    const p = peekable(arr);

    expect(p.peek()).toBe("a");
    expect(p.peek()).toBe("a");
    expect(p.peek()).toBe("a");

    const result = [...p];
    expect(result).toEqual(["a", "b", "c"]);
  });

  it("should work with generator functions", () => {
    function* gen() {
      yield 10;
      yield 20;
      yield 30;
    }

    const p = peekable(gen());
    expect(p.peek()).toBe(10);

    const result = [...p];
    expect(result).toEqual([10, 20, 30]);
  });

  it("should handle peek after partial iteration", () => {
    const arr = [1, 2, 3, 4];
    const p = peekable(arr);

    const iterator = p[Symbol.iterator]();
    iterator.next();
    iterator.next();

    expect(p.peek()).toBe(3);
    expect(iterator.next().value).toBe(3);
    expect(iterator.next().value).toBe(4);
  });

  it("should return undefined when peeking past end", () => {
    const arr = [1];
    const p = peekable(arr);

    const iterator = p[Symbol.iterator]();
    iterator.next();
    iterator.next();

    expect(p.peek()).toBeUndefined();
  });
});
