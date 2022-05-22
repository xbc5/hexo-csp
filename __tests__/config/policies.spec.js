"use strict";
const Config = require("../../lib/config");

const policies = () => [
  {
    pattern: "^foo$",
    prod: {
      mode: "merge",
      directives: {
        ["default-src"]: ["https://prod-foo-default.com"],
      },
    },
    dev: {
      mode: "merge",
      directives: {
        ["default-src"]: ["https://dev-foo-default.com"],
      },
    },
  },
  {
    pattern: "^bar$",
    prod: {
      mode: "merge",
      directives: {
        ["default-src"]: ["https://prod-bar-default.com"],
      },
    },
    dev: {
      mode: "merge",
      directives: {
        ["default-src"]: ["https://dev-bar-default.com"],
      },
    },
  },
];

const factory = (p = policies()) =>
  new Config({
    csp: { policies: p },
  });

it("should return the specified policies as-is", async () => {
  const result = factory().policies;
  expect(result).toMatchSnapshot();
});

it("should return an empty array if there's no policies", async () => {
  const result = factory(null).policies;
  expect(result).toStrictEqual([]);
});

it("should return a clone", async () => {
  // WARN: the constructor clones the entire config, and "policies" getter also clones
  // so even if you remove the getter clone, this will still pass. Leave this in place
  // just in case.
  const p = policies();
  const result = factory(p).policies;

  p[0].pattern = "changed";
  p[0].prod.directives["default-src"].push("changed");
  p[0].prod.mode = "changed";

  expect(result).toStrictEqual(policies());
});
