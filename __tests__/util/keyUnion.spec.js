"use strict";

const { keyUnion } = require("../../lib/util");

describe("when giving keyUnion() three objects", () => {
  it("should merge all keys into a single array", async () => {
    const a = { a: 1 };
    const b = { a: 2, b: 1 };
    const c = { b: 3, d: 4 };

    expect(keyUnion(a, b, c)).toStrictEqual(new Set(["a", "b", "d"]));
  });
});

describe("when giving keyUnion() some undefined values", () => {
  it("should ignore it, merging what it can", async () => {
    const a = { a: 1 };
    const b = undefined;
    const c = undefined;
    const d = { a: 2, b: 3 };

    expect(keyUnion(a, b, c, d)).toStrictEqual(new Set(["a", "b"]));
  });
});

describe("when giving keyUnion() a single argument", () => {
  it("should return a set with one item", async () => {
    const a = { a: 1 };

    expect(keyUnion(a)).toStrictEqual(new Set(["a"]));
  });
});

describe("when giving keyUnion() no arguments", () => {
  it("should return a set with one item", async () => {
    expect(keyUnion()).toStrictEqual(new Set([]));
  });
});

describe("when giving keyUnion() only nullish args", () => {
  it("should return an empty set given a single undefined", async () => {
    expect(keyUnion(undefined)).toStrictEqual(new Set([]));
  });

  it("should return an empty set given multiple undefined", async () => {
    expect(keyUnion(undefined, undefined, undefined)).toStrictEqual(
      new Set([])
    );
  });

  it("should return an empty set given a single null", async () => {
    expect(keyUnion(null)).toStrictEqual(new Set([]));
  });

  it("should return an empty set given multiple nulls", async () => {
    expect(keyUnion(null, null, null)).toStrictEqual(new Set([]));
  });
});
