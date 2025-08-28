import { describe, it, expect } from "vitest";
import { unzip } from "../src/unzip";

describe("unzip", () => {
  it("unzips array of pairs into two arrays", () => {
    const result = unzip([
      [1, "a"],
      [2, "b"],
      [3, "c"],
    ]);
    expect(result).toEqual([
      [1, 2, 3],
      ["a", "b", "c"],
    ]);
  });

  it("handles empty array", () => {
    const result = unzip([]);
    expect(result).toEqual([]);
  });

  it("handles single pair", () => {
    const result = unzip([[42, "answer"]]);
    expect(result).toEqual([[42], ["answer"]]);
  });

  it("works with mixed types", () => {
    const result = unzip([
      [1, true],
      ["hello", null],
      [3.14, undefined],
    ]);
    expect(result).toEqual([
      [1, "hello", 3.14],
      [true, null, undefined],
    ]);
  });

  it("handles pairs with different types", () => {
    const result = unzip([
      ["key1", 100],
      ["key2", 200],
      ["key3", 300],
    ]);
    expect(result).toEqual([
      ["key1", "key2", "key3"],
      [100, 200, 300],
    ]);
  });

  it("works with Set of pairs", () => {
    const result = unzip(
      new Set([
        [1, "a"],
        [2, "b"],
      ])
    );
    expect(result).toEqual([
      [1, 2],
      ["a", "b"],
    ]);
  });

  it("handles pairs with objects", () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const result = unzip([
      [obj1, "first"],
      [obj2, "second"],
    ]);
    expect(result).toEqual([
      [obj1, obj2],
      ["first", "second"],
    ]);
  });

  it("preserves undefined values", () => {
    const result = unzip([
      [1, undefined],
      [undefined, 2],
    ]);
    expect(result).toEqual([
      [1, undefined],
      [undefined, 2],
    ]);
  });

  it("handles nested arrays in pairs", () => {
    const result = unzip([
      [
        [1, 2],
        [3, 4],
      ],
      [
        [5, 6],
        [7, 8],
      ],
    ]);
    expect(result).toEqual([
      [
        [1, 2],
        [5, 6],
      ],
      [
        [3, 4],
        [7, 8],
      ],
    ]);
  });

  it("works with generator of pairs", () => {
    function* pairGen() {
      yield [1, "a"] as [number, string];
      yield [2, "b"] as [number, string];
    }
    const result = unzip(pairGen());
    expect(result).toEqual([
      [1, 2],
      ["a", "b"],
    ]);
  });
});
