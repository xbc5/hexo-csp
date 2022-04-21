"use strict";

const { mergeDirectives } = require("../../lib/util");

describe("when mergeDirectives() is given three sets of directives", () => {
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

    expect(mergeDirectives(a, b, c)).toStrictEqual(expected);
  });
});

describe("when mergeDirectives() is given empty directives", () => {
  it("should merge them", async () => {
    const a = {
      "default-src": ["'self'", "https://foo.com"],
    };
    const b = {};
    const c = {};
    const expected = {
      "default-src": ["'self'", "https://foo.com"],
    };

    expect(mergeDirectives(a, b, c)).toStrictEqual(expected);
  });
});

describe("when mergeDirectives() is given undefined directives", () => {
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

    expect(mergeDirectives(a, b, c, d)).toStrictEqual(expected);
  });

  it("should return an empty object if all undefined", async () => {
    expect(mergeDirectives(undefined, undefined, undefined)).toStrictEqual({});
  });
});
