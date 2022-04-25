"use strict";
const Config = require("../../lib/config");

test("that the config is cloned, and not mutated", () => {
  const initial = {
    default: {
      directives: {
        "default-src": ["'self'"],
      },
    },
  };

  const config = new Config({
    csp: { prod: { policies: initial } },
  }).addPolicies();

  // test against initial object, because defaults are injected
  // into the received config. This means that initial will be mutated
  // if it's cloned, so expect it to be the same (not mutated; instead
  // clone first)
  expect(config.policies).toMatchObject(initial);
});

[null, undefined].forEach((arg) => {
  test(`that he config handle ${
    arg === undefined ? "undefined" : "null"
  }`, () => {
    expect(() => new Config(arg)).not.toThrow();
  });
});
