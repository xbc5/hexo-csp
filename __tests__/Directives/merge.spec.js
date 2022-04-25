"use strict";

const Directives = require("../../lib/Directives");

describe("when given three sets of directives", () => {
  it("should merge them", async () => {
    const a = {
      "default-src": ["'self'", "https://foo.com"],
    };
    const b = {
      "default-src": ["'self'"],
      "img-src": ["https://bar.net"],
    };
    const c = {
      "img-src": ["https://bar.net", "https://foobar.com", "https://baz.net"],
    };
    const expected = {
      "default-src": ["'self'", "https://foo.com"],
      "img-src": ["https://bar.net", "https://foobar.com", "https://baz.net"],
    };

    expect(Directives.merge(a, b, c)).toStrictEqual(expected);
  });
});

describe("when given empty directives", () => {
  it("should merge them", async () => {
    const a = {
      "default-src": ["'self'", "https://foo.com"],
    };
    const b = {};
    const c = {};
    const expected = {
      "default-src": ["'self'", "https://foo.com"],
    };

    expect(Directives.merge(a, b, c)).toStrictEqual(expected);
  });
});

describe("when given undefined directives", () => {
  it("should ignore undefined and merge what it can", async () => {
    const a = {
      "default-src": ["'self'", "https://foo.com"],
    };
    const b = undefined;
    const c = undefined;
    const d = {
      "default-src": ["'self'", "https://bar.com"],
    };

    const expected = {
      "default-src": ["'self'", "https://foo.com", "https://bar.com"],
    };

    expect(Directives.merge(a, b, c, d)).toStrictEqual(expected);
  });

  it("should return an empty object if all undefined", async () => {
    expect(Directives.merge(undefined, undefined, undefined)).toStrictEqual({});
  });
});
