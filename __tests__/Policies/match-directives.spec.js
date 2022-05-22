"use strict";

const { initial, factory, arg } = require("./util");
const clone = require("lodash.clonedeep");

["match", "directives"].forEach((method) => {
  describe(`${method}()`, () => {
    it("should be defined", async () => {
      const result = factory()[method];
      expect(result).toBeDefined();
    });
  });
});

[
  {
    arg: undefined,
    initial: initial(),
    method: "match",
    strategy: "the constructor",
  },
  { arg: arg(), initial: undefined, method: "match", strategy: "a method arg" },
  {
    arg: undefined,
    initial: initial(),
    method: "directives",
    strategy: "the constructor",
  },
  {
    arg: arg(),
    initial: undefined,
    method: "directives",
    strategy: "a method arg",
  },
].forEach(({ arg, initial, strategy, method }) => {
  describe(`${method}()`, () => {
    describe(`when passing policies via ${strategy}`, () => {
      it("should return the matched policy", async () => {
        const result = factory({ initial })[method]("foo", arg);
        expect(result).toMatchSnapshot();
      });

      it("should return multiple matched policies", async () => {
        const reset = (target) => {
          const r = clone(target);
          r[0].pattern = "foo";
          r[1].pattern = "bar";
          return r;
        };

        let i, a;
        if (initial) i = reset(initial);
        if (arg) a = reset(arg);

        const result = factory({ initial: i })[method]("foobar", a);
        expect(result).toMatchSnapshot();
      });

      it("should not return any policies if not matched", async () => {
        const result = factory({ initial })[method]("xyz", arg);
        expect(result).toMatchSnapshot();
      });
    });
  });
});
