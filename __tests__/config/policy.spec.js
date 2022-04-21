"use strict";

const Config = require("../../lib/config");

describe("for Config.policy", () => {
  it("should return the requested policy", async () => {
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
      directives: {
        "default-src": ["'self'"],
        "img-src": ["https://foo.com", "https://baz.com"],
      },
    };
    const config = new Config({ csp: { prod: { policies } } });
    expect(config.policy("foo/index.html")).toMatchObject(expected);
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
          expect(config.policy("foo/index.html")).toMatchObject({});
        });
      });
    });
  });
});
