import { describe, it, expect } from "vitest";
import { Iter } from "../src";

describe("Iter", () => {
  describe("constructor", () => {
    it("creates from iterable", () => {
      const iter = new Iter([1, 2, 3]);
      expect(iter.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe("static methods", () => {
    describe("from", () => {
      it("creates from static from", () => {
        const iter = Iter.from([1, 2, 3]);
        expect(iter.toArray()).toEqual([1, 2, 3]);
      });
    });

    describe("fromRange", () => {
      it("creates from range", () => {
        const iter = Iter.fromRange(5);
        expect(iter.toArray()).toEqual([0, 1, 2, 3, 4, 5]);
      });
    });

    describe("gen", () => {
      it("creates from generator", () => {
        const iter = Iter.gen(i => i * 2);
        expect(iter.take(3).toArray()).toEqual([0, 2, 4]);
      });
    });

    describe("search", () => {
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
  });

  describe("transformation methods", () => {
    describe("map", () => {
      it("maps values", () => {
        const result = new Iter([1, 2, 3]).map(x => x * 2).toArray();
        expect(result).toEqual([2, 4, 6]);
      });
    });

    describe("filter", () => {
      it("filters values", () => {
        const result = new Iter([1, 2, 3, 4])
          .filter(x => x % 2 === 0)
          .toArray();
        expect(result).toEqual([2, 4]);
      });
    });

    describe("enumerate", () => {
      it("enumerates with indices", () => {
        const result = new Iter(["a", "b", "c"]).enumerate().toArray();
        expect(result).toEqual([
          [0, "a"],
          [1, "b"],
          [2, "c"],
        ]);
      });
    });

    describe("unique", () => {
      it("removes duplicates", () => {
        const result = new Iter([1, 2, 2, 3, 3, 3]).unique().toArray();
        expect(result).toEqual([1, 2, 3]);
      });
    });

    describe("uniqueBy", () => {
      it("removes duplicates by function", () => {
        const people = [
          { name: "Alice", age: 25 },
          { name: "Bob", age: 30 },
          { name: "Alice", age: 26 },
        ];
        const result = new Iter(people)
          .uniqueBy(person => person.name)
          .toArray();
        expect(result).toHaveLength(2);
        expect(result.map(p => p.name)).toEqual(["Alice", "Bob"]);
      });
    });

    describe("groupBy", () => {
      it("groups elements by function result", () => {
        const result = new Iter([1, 2, 3, 4, 5, 6]).groupBy(x => x % 2);
        expect(result.get(1)).toEqual([1, 3, 5]);
        expect(result.get(0)).toEqual([2, 4, 6]);
        expect(result.size).toBe(2);
      });
    });

    describe("groupByIter", () => {
      it("returns Iter instance with grouped results", () => {
        const result = new Iter([1, 2, 3, 4, 5, 6]).groupByIter(x => x % 2);

        // Check that result is an Iter instance
        expect(result).toBeInstanceOf(Iter);

        // Convert to Map to test the grouped results
        const resultMap = new Map(result.toArray());
        expect(resultMap.get(1)).toEqual([1, 3, 5]);
        expect(resultMap.get(0)).toEqual([2, 4, 6]);
        expect(resultMap.size).toBe(2);
      });
    });
  });

  describe("utility methods", () => {
    describe("tap", () => {
      it("taps for side effects", () => {
        const sideEffects: number[] = [];
        const result = new Iter([1, 2, 3])
          .tap(x => sideEffects.push(x * 2))
          .toArray();
        expect(result).toEqual([1, 2, 3]);
        expect(sideEffects).toEqual([2, 4, 6]);
      });
    });

    describe("scan", () => {
      it("scans for running totals", () => {
        const result = new Iter([1, 2, 3, 4])
          .scan((acc, x) => acc + x, 0)
          .toArray();
        expect(result).toEqual([1, 3, 6, 10]);
      });
    });

    describe("chunk", () => {
      it("chunks into groups", () => {
        const result = new Iter([1, 2, 3, 4, 5]).chunk(2).toArray();
        expect(result).toEqual([[1, 2], [3, 4], [5]]);
      });
    });

    describe("take", () => {
      it("takes first n elements", () => {
        const result = new Iter([1, 2, 3, 4, 5]).take(3).toArray();
        expect(result).toEqual([1, 2, 3]);
      });
    });

    describe("skip", () => {
      it("skips first n elements", () => {
        const result = new Iter([1, 2, 3, 4, 5]).skip(2).toArray();
        expect(result).toEqual([3, 4, 5]);
      });
    });

    describe("takeWhile", () => {
      it("takes while condition is true", () => {
        const result = new Iter([1, 2, 3, 4, 5])
          .takeWhile(x => x < 4)
          .toArray();
        expect(result).toEqual([1, 2, 3]);
      });
    });

    describe("skipWhile", () => {
      it("skips while condition is true", () => {
        const result = new Iter([1, 2, 3, 4, 5])
          .skipWhile(x => x < 3)
          .toArray();
        expect(result).toEqual([3, 4, 5]);
      });
    });
  });

  describe("terminal methods", () => {
    describe("find", () => {
      it("finds first matching element", () => {
        const result = new Iter([1, 2, 3, 4]).find(x => x > 2);
        expect(result).toBe(3);
      });
    });

    describe("findIndex", () => {
      it("finds index of first matching element", () => {
        const result = new Iter(["a", "b", "c"]).findIndex(x => x === "b");
        expect(result).toBe(1);
      });
    });

    describe("some", () => {
      it("checks if any element matches", () => {
        const result = new Iter([1, 2, 3]).some(x => x > 2);
        expect(result).toBe(true);
      });
    });

    describe("every", () => {
      it("checks if all elements match", () => {
        const result = new Iter([2, 4, 6]).every(x => x % 2 === 0);
        expect(result).toBe(true);
      });
    });

    describe("count", () => {
      it("counts elements", () => {
        const result = new Iter([1, 2, 3, 4, 5]).count();
        expect(result).toBe(5);
      });
    });

    describe("isEmpty", () => {
      it("checks if empty", () => {
        expect(new Iter([]).isEmpty()).toBe(true);
        expect(new Iter([1]).isEmpty()).toBe(false);
      });
    });

    describe("reduce", () => {
      it("reduces to single value", () => {
        const result = new Iter([1, 2, 3, 4]).reduce((acc, x) => acc + x, 0);
        expect(result).toBe(10);
      });
    });

    describe("first", () => {
      it("gets first element", () => {
        expect(new Iter([1, 2, 3]).first()).toBe(1);
        expect(new Iter([]).first()).toBe(undefined);
      });
    });

    describe("last", () => {
      it("gets last element", () => {
        expect(new Iter([1, 2, 3]).last()).toBe(3);
        expect(new Iter([]).last()).toBe(undefined);
      });
    });

    describe("join", () => {
      it("joins elements", () => {
        const result = new Iter(["a", "b", "c"]).join("-");
        expect(result).toBe("a-b-c");
      });
    });
  });

  describe("mathematical operations", () => {
    describe("sum", () => {
      it("sums numbers", () => {
        const result = new Iter([1, 2, 3, 4]).sum();
        expect(result).toBe(10);
      });
    });

    describe("product", () => {
      it("multiplies numbers", () => {
        const result = new Iter([2, 3, 4]).product();
        expect(result).toBe(24);
      });
    });

    describe("average", () => {
      it("averages numbers", () => {
        const result = new Iter([2, 4, 6]).average();
        expect(result).toBe(4);
      });
    });

    describe("min", () => {
      it("finds min", () => {
        const result = new Iter([3, 1, 4, 1, 5]).min();
        expect(result).toBe(1);
      });
    });

    describe("max", () => {
      it("finds max", () => {
        const result = new Iter([3, 1, 4, 1, 5]).max();
        expect(result).toBe(5);
      });
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
      const manual: number[] = [];
      for (const item of iter) {
        manual.push(item);
      }
      expect(manual).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
