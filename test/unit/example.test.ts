import { describe, expect, it } from "vitest";

describe("example unit tests", () => {
  it("should perform basic arithmetic", () => {
    expect(1 + 1).toBe(2);
    expect(5 - 3).toBe(2);
    expect(2 * 3).toBe(6);
    expect(10 / 2).toBe(5);
  });

  it("should handle string operations", () => {
    expect("hello".toUpperCase()).toBe("HELLO");
    expect("WORLD".toLowerCase()).toBe("world");
    expect("hello world".split(" ")).toEqual(["hello", "world"]);
  });

  it("should work with arrays", () => {
    const arr = [1, 2, 3, 4, 5];

    expect(arr.length).toBe(5);
    expect(arr[0]).toBe(1);
    expect(arr.includes(3)).toBe(true);
    expect(arr.filter((n) => n > 2)).toEqual([3, 4, 5]);
  });

  it("should work with objects", () => {
    const obj = { name: "Test", age: 25 };

    expect(obj.name).toBe("Test");
    expect(obj.age).toBe(25);
    expect(Object.keys(obj)).toEqual(["name", "age"]);
  });

  it("should handle truthiness", () => {
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
    expect(null).toBeFalsy();
    expect(undefined).toBeFalsy();
    expect(0).toBeFalsy();
    expect("").toBeFalsy();
    expect("value").toBeTruthy();
    expect(1).toBeTruthy();
  });

  it("should compare objects", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };

    expect(obj1).toEqual(obj2);
    expect(obj1).not.toBe(obj2); // Different references
  });

  it("should handle async operations", async () => {
    const asyncFunc = async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve("done"), 10);
      });
    };

    const result = await asyncFunc();
    expect(result).toBe("done");
  });
});
