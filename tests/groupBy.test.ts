import { describe, it, expect } from "vitest";
import { groupBy } from "../src/groupBy";

describe("groupBy", () => {
  it("groups array elements by function result", () => {
    const input = [1, 2, 3, 4, 5, 6];
    const result = groupBy(input, x => x % 2);

    expect(result.get(1)).toEqual([1, 3, 5]);
    expect(result.get(0)).toEqual([2, 4, 6]);
    expect(result.size).toBe(2);
  });

  it("groups array elements by property key", () => {
    const input = [
      { type: "fruit", name: "apple" },
      { type: "vegetable", name: "carrot" },
      { type: "fruit", name: "banana" },
      { type: "vegetable", name: "broccoli" },
    ];
    const result = groupBy(input, "type");

    expect(result.get("fruit")).toEqual([
      { type: "fruit", name: "apple" },
      { type: "fruit", name: "banana" },
    ]);
    expect(result.get("vegetable")).toEqual([
      { type: "vegetable", name: "carrot" },
      { type: "vegetable", name: "broccoli" },
    ]);
    expect(result.size).toBe(2);
  });

  it("works with function that receives index parameter", () => {
    const input = ["a", "b", "c", "d"];
    const result = groupBy(input, (item, index) => index < 2);

    expect(result.get(true)).toEqual(["a", "b"]);
    expect(result.get(false)).toEqual(["c", "d"]);
    expect(result.size).toBe(2);
  });

  it("works in curried form with function", () => {
    const groupByEvenOdd = groupBy((x: number) =>
      x % 2 === 0 ? "even" : "odd"
    );
    const result = groupByEvenOdd([1, 2, 3, 4, 5]);

    expect(result.get("odd")).toEqual([1, 3, 5]);
    expect(result.get("even")).toEqual([2, 4]);
    expect(result.size).toBe(2);
  });

  it("works in curried form with property key", () => {
    const groupByType = groupBy("type");
    const input = [
      { type: "A", value: 1 },
      { type: "B", value: 2 },
      { type: "A", value: 3 },
    ];
    const result = groupByType(input);

    expect(result.get("A")).toEqual([
      { type: "A", value: 1 },
      { type: "A", value: 3 },
    ]);
    expect(result.get("B")).toEqual([{ type: "B", value: 2 }]);
    expect(result.size).toBe(2);
  });

  it("handles empty array", () => {
    const result = groupBy([], x => x);
    expect(result.size).toBe(0);
  });

  it("handles single element", () => {
    const result = groupBy([42], x => x > 40);
    expect(result.get(true)).toEqual([42]);
    expect(result.size).toBe(1);
  });

  it("groups Set elements", () => {
    const input = new Set([1, 2, 3, 4, 5]);
    const result = groupBy(input, x => x <= 3);

    expect(result.get(true)).toEqual([1, 2, 3]);
    expect(result.get(false)).toEqual([4, 5]);
    expect(result.size).toBe(2);
  });

  it("groups generator values", () => {
    function* gen() {
      yield "apple";
      yield "apricot";
      yield "banana";
      yield "avocado";
    }
    const result = groupBy(gen(), word => word[0]);

    expect(result.get("a")).toEqual(["apple", "apricot", "avocado"]);
    expect(result.get("b")).toEqual(["banana"]);
    expect(result.size).toBe(2);
  });

  it("handles complex grouping keys", () => {
    const input = [
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ];
    const result = groupBy(input, item => `${item.x}-${item.y}`);

    expect(result.get("1-2")).toEqual([{ x: 1, y: 2 }]);
    expect(result.get("1-3")).toEqual([{ x: 1, y: 3 }]);
    expect(result.get("2-2")).toEqual([{ x: 2, y: 2 }]);
    expect(result.get("2-3")).toEqual([{ x: 2, y: 3 }]);
    expect(result.size).toBe(4);
  });

  it("handles duplicate values correctly", () => {
    const input = [1, 1, 2, 2, 3, 3];
    const result = groupBy(input, x => x);

    expect(result.get(1)).toEqual([1, 1]);
    expect(result.get(2)).toEqual([2, 2]);
    expect(result.get(3)).toEqual([3, 3]);
    expect(result.size).toBe(3);
  });

  it("handles null and undefined keys", () => {
    const input = [
      { key: null, value: "a" },
      { key: undefined, value: "b" },
      { key: null, value: "c" },
    ];
    const result = groupBy(input, "key");

    expect(result.get(null)).toEqual([
      { key: null, value: "a" },
      { key: null, value: "c" },
    ]);
    expect(result.get(undefined)).toEqual([{ key: undefined, value: "b" }]);
    expect(result.size).toBe(2);
  });

  it("preserves insertion order within groups", () => {
    const input = ["z", "a", "y", "b", "x", "c"];
    const result = groupBy(input, char => char < "m");

    expect(result.get(true)).toEqual(["a", "b", "c"]);
    expect(result.get(false)).toEqual(["z", "y", "x"]);
    expect(result.size).toBe(2);
  });

  it("works with nested property access", () => {
    const input = [
      { user: { role: "admin" }, id: 1 },
      { user: { role: "user" }, id: 2 },
      { user: { role: "admin" }, id: 3 },
    ];
    const result = groupBy(input, item => item.user.role);

    expect(result.get("admin")).toEqual([
      { user: { role: "admin" }, id: 1 },
      { user: { role: "admin" }, id: 3 },
    ]);
    expect(result.get("user")).toEqual([{ user: { role: "user" }, id: 2 }]);
    expect(result.size).toBe(2);
  });
});
