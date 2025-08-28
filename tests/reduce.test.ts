import { describe, it, expect } from "vitest";
import { reduce } from "../src/reduce";

describe("reduce", () => {
  it("reduces array to sum", () => {
    const result = reduce([1, 2, 3, 4], (acc, x) => acc + x, 0);
    expect(result).toBe(10);
  });

  it("reduces array to product", () => {
    const result = reduce([2, 3, 4], (acc, x) => acc * x, 1);
    expect(result).toBe(24);
  });

  it("reduces with index parameter", () => {
    const result = reduce(
      ["a", "b", "c"],
      (acc, item, index) => acc + `${index}:${item} `,
      ""
    );
    expect(result).toBe("0:a 1:b 2:c ");
  });

  it("works in curried form", () => {
    const sum = reduce((acc: number, x: number) => acc + x);
    const result = sum([1, 2, 3]);
    expect(result).toBe(6);
  });

  it("reduces empty array with initial value", () => {
    const result = reduce([], (acc: number, x: number) => acc + x, 42);
    expect(result).toBe(42);
  });

  it("reduces single element array", () => {
    const result = reduce([5], (acc, x) => acc + x, 10);
    expect(result).toBe(15);
  });

  it("reduces string to character count object", () => {
    const result = reduce(
      "hello",
      (acc: Record<string, number>, char) => {
        acc[char] = (acc[char] || 0) + 1;
        return acc;
      },
      {}
    );
    expect(result).toEqual({ h: 1, e: 1, l: 2, o: 1 });
  });

  it("reduces Set elements", () => {
    const result = reduce(new Set([1, 2, 3]), (acc, x) => acc + x, 0);
    expect(result).toBe(6);
  });

  it("reduces to array (like map)", () => {
    const result = reduce(
      [1, 2, 3],
      (acc: number[], x) => {
        acc.push(x * 2);
        return acc;
      },
      []
    );
    expect(result).toEqual([2, 4, 6]);
  });
});
