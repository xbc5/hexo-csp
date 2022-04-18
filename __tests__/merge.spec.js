const template = require("./helpers/template");
const { merge } = require("../lib");

describe("merge()", () => {
  it("it should merge two objects", async () => {
    const a = { a: { b: "b" }, c: "c" };
    const b = { a: { b: "b*" }, d: "d" };
    const expected = { a: { b: "b*" }, c: "c", d: "d" };

    expect(merge(a, b)).toStrictEqual(expected);
  });

  it("it should merge three objects", async () => {
    const a = { a: { b: "b" }, c: "c", e: [{ f: "f" }, "foo"] };
    const b = { a: { b: "b*" }, d: "d" };
    const c = {
      a: { b: "b**", x: { y: "y" } },
      d: "d",
      e: [{ f: "f*", g: "g" }, "bar"],
    };
    const expected = {
      a: { b: "b**", x: { y: "y" } },
      c: "c",
      d: "d",
      e: [{ f: "f*", g: "g" }, "bar"],
    };

    expect(merge(a, b, c)).toStrictEqual(expected);
  });
});
