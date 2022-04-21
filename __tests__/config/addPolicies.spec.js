"use strict";
const Config = require("../../lib/config");

describe("given undefined args", () => {
  it("should do nothing", async () => {
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

    expect(config.policies).toMatchObject(initial);
  });
});

describe("given an empty object", () => {
  it("should do nothing", async () => {
    const initial = {
      default: {
        directives: {
          "default-src": ["'self'"],
        },
      },
    };

    const config = new Config({
      csp: { prod: { policies: initial } },
    }).addPolicies({});

    expect(config.policies).toMatchObject(initial);
  });
});

describe("given a new policy with a new path", () => {
  it("should append it", async () => {
    const initial = {
      default: {
        directives: {
          "default-src": ["'self'"],
          "img-src": ["https://initial-default-img.com"],
        },
      },
      "foo/index.html": {
        directives: {
          "default-src": ["'self'", "https://initial-foo-default.com"],
          "img-src": ["https://initial-foo-img.com"],
        },
      },
    };
    const added = {
      "added/index.html": {
        directives: {
          "default-src": ["'self'", "https://added-default.com"],
          "img-src": ["https://added-img.com"],
        },
      },
    };

    const expected = {
      default: {
        directives: {
          "default-src": ["'self'"],
          "img-src": ["https://initial-default-img.com"],
        },
      },
      "foo/index.html": {
        directives: {
          "default-src": ["'self'", "https://initial-foo-default.com"],
          "img-src": ["https://initial-foo-img.com"],
        },
      },
      "added/index.html": {
        directives: {
          "default-src": ["'self'", "https://added-default.com"],
          "img-src": ["https://added-img.com"],
        },
      },
    };

    const config = new Config({
      csp: { prod: { policies: initial } },
    }).addPolicies(added);

    expect(config.policies).toMatchObject(expected);
  });
});

describe("given a new policy with an existing path", () => {
  describe("and mode=merge", () => {
    it("should merge it with the policy of the same path", async () => {
      const initial = {
        default: {
          directives: {
            "default-src": ["'self'"],
            "img-src": ["https://initial-default-img.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "default-src": ["'self'", "https://initial-foo-default.com"],
            "img-src": ["https://initial-foo-img.com"],
          },
        },
      };
      const added = {
        "foo/index.html": {
          directives: {
            "default-src": ["'self'", "https://added-foo-default.com"],
            "img-src": ["https://added-foo-img.com"],
          },
        },
      };

      const expected = {
        default: {
          directives: {
            "default-src": ["'self'"],
            "img-src": ["https://initial-default-img.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "default-src": [
              "'self'",
              "https://initial-foo-default.com",
              "https://added-foo-default.com",
            ],
            "img-src": [
              "https://initial-foo-img.com",
              "https://added-foo-img.com",
            ],
          },
        },
      };

      const config = new Config({
        csp: { mode: "merge", prod: { policies: initial } },
      }).addPolicies(added);

      expect(config.policies).toMatchObject(expected);
    });
  });

  it("should merge it multiple times if requested", async () => {
    const initial = {
      default: {
        directives: {
          "default-src": ["'self'"],
          "img-src": ["https://initial-default-img.com"],
        },
      },
      "foo/index.html": {
        directives: {
          "default-src": ["'self'", "https://initial-foo-default.com"],
          "img-src": ["https://initial-foo-img.com"],
        },
      },
    };
    const added1 = {
      "foo/index.html": {
        directives: {
          "default-src": ["'self'", "https://added-foo-default.com"],
          "img-src": ["https://added-foo-img.com"],
        },
      },
    };

    const added2 = {
      "added2/index.html": {
        directives: {
          "default-src": ["'self'", "https://added-added2-default.com"],
          "img-src": ["https://added-added2-img.com"],
        },
      },
    };

    const added3 = {
      "foo/index.html": {
        directives: {
          "default-src": ["'self'", "https://added3-foo-default.com"],
          "img-src": ["https://added3-foo-img.com"],
        },
      },
    };

    const expected = {
      default: {
        directives: {
          "default-src": ["'self'"],
          "img-src": ["https://initial-default-img.com"],
        },
      },
      "foo/index.html": {
        directives: {
          "default-src": [
            "'self'",
            "https://initial-foo-default.com",
            "https://added-foo-default.com",
            "https://added3-foo-default.com",
          ],
          "img-src": [
            "https://initial-foo-img.com",
            "https://added-foo-img.com",
            "https://added3-foo-img.com",
          ],
        },
      },
      "added2/index.html": {
        directives: {
          "default-src": ["'self'", "https://added-added2-default.com"],
          "img-src": ["https://added-added2-img.com"],
        },
      },
    };

    const config = new Config({
      csp: { mode: "merge", prod: { policies: initial } },
    })
      .addPolicies(added1)
      .addPolicies(added2, added3);

    expect(config.policies).toMatchObject(expected);
  });
});
