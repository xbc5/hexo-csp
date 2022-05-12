"use strict";

const Config = require("../../lib/config");

describe("for Config.directives", () => {
  it("should return the requested directives", async () => {
    const policies = {
      default: {
        directives: {
          "default-src": ["'self'"],
          "img-src": ["https://bar.com"],
        },
      },
      "foo/index.html": {
        directives: {
          "default-src": ["'self'"],
          "img-src": ["https://foo.com", "https://baz.com"],
        },
      },
    };

    const expected = {
      "default-src": ["'self'"],
      "img-src": ["https://foo.com", "https://baz.com"],
    };
    const config = new Config({ csp: { prod: { policies } } });
    expect(config.directives("foo/index.html")).toMatchObject(expected);
  });

  it("should match against multiple policies", async () => {
    const policies = {
      "^[a-z]+/index.html$": {
        directives: {
          "default-src": ["https://foo-default.com"],
          "img-src": ["https://foo-img.com"],
        },
      },
      "^foo/index.html$": {
        directives: {
          "default-src": ["https://foobar-default.com"],
          "img-src": ["https://foobar-img.com"],
        },
      },
    };

    const expected = {
      "default-src": ["https://foo-default.com", "https://foobar-default.com"],
      "img-src": ["https://foo-img.com", "https://foobar-img.com"],
    };
    const config = new Config({ csp: { prod: { policies } } });
    expect(config.directives("foo/index.html")).toMatchObject(expected);
  });

  describe("defaults (no policies)", () => {
    [
      undefined,
      {},
      { csp: {} },
      { csp: { prod: {} } },
      { csp: { prod: { policies: {} } } },
    ].forEach((conf) => {
      const msg = conf === undefined ? undefined : JSON.stringify(conf);

      describe(`when the config object is ${msg}`, () => {
        it("should return an empty object", async () => {
          const config = new Config(conf);
          expect(config.directives("foo/index.html")).toMatchObject({});
        });
      });
    });
  });
});
