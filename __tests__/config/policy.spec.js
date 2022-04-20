const Config = require("../../lib/config");

const DEFAULT = {};

describe("for Config.prod.policies", () => {
  it("should return the provided value", async () => {
    const policies = {
      default: {
        "default-src": ["'self'"],
        "img-src": ["https://bar.com"],
      },
      "foo/index.html": {
        "default-src": ["'self'"],
        "img-src": ["https://foo.com", "https://baz.com"],
      },
    };

    const expected = {
      path: "foo/index.html",
      directives: {
        "default-src": ["'self'"],
        "img-src": ["https://foo.com", "https://baz.com"],
      },
    };
    const config = new Config({ csp: { prod: { policies } } });
    expect(config.policy("foo/index.html")).toMatchObject(expected);
  });

  it("should return an empty object if no policies", async () => {
    const config = new Config({ csp: { prod: {} } });
    expect(config.policy("foo/index.html")).toMatchObject(DEFAULT);
  });

  it("should return an empty object if no prod object", async () => {
    const config = new Config({ csp: {} });
    expect(config.policy("foo/index.html")).toMatchObject(DEFAULT);
  });
});
