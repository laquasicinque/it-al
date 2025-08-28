import { describe, it, expect } from "vitest";
import { Iter } from "../src/Iter";

describe("Iter", () => {
  describe("constructor and static methods", () => {
    it("creates from iterable", () => {
      const iter = new Iter([1, 2, 3]);
      expect(iter.toArray()).toEqual([1, 2, 3]);
    });

    it("creates from static from", () => {
      const iter = Iter.from([1, 2, 3]);
      expect(iter.toArray()).toEqual([1, 2, 3]);
    });

    it("creates from range", () => {
      const iter = Iter.fromRange(5);
      expect(iter.toArray()).toEqual([0, 1, 2, 3, 4, 5]);
    });

    it("creates from generator", () => {
      const iter = Iter.gen(i => i * 2);
      expect(iter.take(3).toArray()).toEqual([0, 2, 4]);
    });

    it("searches objects", () => {
      const results = Iter.search(
        { a: 1, b: { c: 2 } },
        (path, val) => typeof val === "number"
      );
      expect(results.toArray()).toEqual([
        [["a"], 1],
        [["b", "c"], 2],
      ]);
    });
  });

  describe("transformation methods", () => {
    it("maps values", () => {
      const result = new Iter([1, 2, 3]).map(x => x * 2).toArray();
      expect(result).toEqual([2, 4, 6]);
    });

    it("filters values", () => {
      const result = new Iter([1, 2, 3, 4]).filter(x => x % 2 === 0).toArray();
      expect(result).toEqual([2, 4]);
    });

    it("chains operations", () => {
      const result = new Iter([1, 2, 3, 4, 5])
        .filter(x => x % 2 === 1)
        .map(x => x * 10)
        .toArray();
      expect(result).toEqual([10, 30, 50]);
    });

    it("enumerates with indices", () => {
      const result = new Iter(["a", "b", "c"]).enumerate().toArray();
      expect(result).toEqual([
        [0, "a"],
        [1, "b"],
        [2, "c"],
      ]);
    });

    it("removes duplicates", () => {
      const result = new Iter([1, 2, 2, 3, 3, 3]).unique().toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it("removes duplicates by function", () => {
      const people = [
        { name: "Alice", age: 25 },
        { name: "Bob", age: 30 },
        { name: "Alice", age: 26 },
      ];
      const result = new Iter(people).uniqueBy(person => person.name).toArray();
      expect(result).toHaveLength(2);
      expect(result.map(p => p.name)).toEqual(["Alice", "Bob"]);
    });
  });

  describe("utility methods", () => {
    it("taps for side effects", () => {
      const sideEffects: number[] = [];
      const result = new Iter([1, 2, 3])
        .tap(x => sideEffects.push(x * 2))
        .toArray();
      expect(result).toEqual([1, 2, 3]);
      expect(sideEffects).toEqual([2, 4, 6]);
    });

    it("scans for running totals", () => {
      const result = new Iter([1, 2, 3, 4])
        .scan((acc, x) => acc + x, 0)
        .toArray();
      expect(result).toEqual([1, 3, 6, 10]);
    });

    it("chunks into groups", () => {
      const result = new Iter([1, 2, 3, 4, 5]).chunk(2).toArray();
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it("takes first n elements", () => {
      const result = new Iter([1, 2, 3, 4, 5]).take(3).toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it("skips first n elements", () => {
      const result = new Iter([1, 2, 3, 4, 5]).skip(2).toArray();
      expect(result).toEqual([3, 4, 5]);
    });

    it("takes while condition is true", () => {
      const result = new Iter([1, 2, 3, 4, 5]).takeWhile(x => x < 4).toArray();
      expect(result).toEqual([1, 2, 3]);
    });

    it("skips while condition is true", () => {
      const result = new Iter([1, 2, 3, 4, 5]).skipWhile(x => x < 3).toArray();
      expect(result).toEqual([3, 4, 5]);
    });
  });

  describe("terminal methods", () => {
    it("finds first matching element", () => {
      const result = new Iter([1, 2, 3, 4]).find(x => x > 2);
      expect(result).toBe(3);
    });

    it("finds index of first matching element", () => {
      const result = new Iter(["a", "b", "c"]).findIndex(x => x === "b");
      expect(result).toBe(1);
    });

    it("checks if any element matches", () => {
      const result = new Iter([1, 2, 3]).some(x => x > 2);
      expect(result).toBe(true);
    });

    it("checks if all elements match", () => {
      const result = new Iter([2, 4, 6]).every(x => x % 2 === 0);
      expect(result).toBe(true);
    });

    it("counts elements", () => {
      const result = new Iter([1, 2, 3, 4, 5]).count();
      expect(result).toBe(5);
    });

    it("checks if empty", () => {
      expect(new Iter([]).isEmpty()).toBe(true);
      expect(new Iter([1]).isEmpty()).toBe(false);
    });

    it("reduces to single value", () => {
      const result = new Iter([1, 2, 3, 4]).reduce((acc, x) => acc + x, 0);
      expect(result).toBe(10);
    });

    it("gets first element", () => {
      expect(new Iter([1, 2, 3]).first()).toBe(1);
      expect(new Iter([]).first()).toBe(undefined);
    });

    it("gets last element", () => {
      expect(new Iter([1, 2, 3]).last()).toBe(3);
      expect(new Iter([]).last()).toBe(undefined);
    });

    it("joins elements", () => {
      const result = new Iter(["a", "b", "c"]).join("-");
      expect(result).toBe("a-b-c");
    });
  });

  describe("mathematical operations", () => {
    it("sums numbers", () => {
      const result = new Iter([1, 2, 3, 4]).sum();
      expect(result).toBe(10);
    });

    it("multiplies numbers", () => {
      const result = new Iter([2, 3, 4]).product();
      expect(result).toBe(24);
    });

    it("averages numbers", () => {
      const result = new Iter([2, 4, 6]).average();
      expect(result).toBe(4);
    });

    it("finds min", () => {
      const result = new Iter([3, 1, 4, 1, 5]).min();
      expect(result).toBe(1);
    });

    it("finds max", () => {
      const result = new Iter([3, 1, 4, 1, 5]).max();
      expect(result).toBe(5);
    });
  });

  describe("complex chains", () => {
    it("processes complex data pipeline", () => {
      const data = [
        { name: "Alice", scores: [85, 92, 88] },
        { name: "Bob", scores: [76, 81, 79] },
        { name: "Charlie", scores: [95, 89, 91] },
      ];

      const result = new Iter(data)
        .map(person => ({
          name: person.name,
          average: new Iter(person.scores).average(),
        }))
        .filter(person => person.average >= 80)
        .pluck("name")
        .toArray();

      expect(result).toEqual(["Alice", "Charlie"]);
    });

    it("works with iterators", () => {
      const iter = new Iter([1, 2, 3, 4, 5]);

      // Should be iterable
      const manual = [];
      for (const item of iter) {
        manual.push(item);
      }
      expect(manual).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
