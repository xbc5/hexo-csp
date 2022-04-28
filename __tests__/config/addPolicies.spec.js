"use strict";
const Config = require("../../lib/config");
const { validatePolicies } = require("../../lib/validation");

describe("given undefined args", () => {
  it("should not update policies", async () => {
    const initial = {
      default: {
        directives: {
          "default-src": ["'self'"],
        },
      },
    };

    const config = new Config({
      csp: { prod: { policies: initial } },
    });
    config.addPolicies();

    expect(config.policies).toMatchObject(initial);
  });

  it("should return an empty list", async () => {
    const initial = {
      default: {
        directives: {
          "default-src": ["'self'"],
        },
      },
    };

    const config = new Config({
      csp: { prod: { policies: initial } },
    });
    const errors = config.addPolicies();

    expect(errors).toStrictEqual([]);
  });
});

describe("given an invalid policy", () => {
  function fixture() {
    const initial = {
      default: {
        directives: {
          "default-src": ["'self'"],
        },
      },
    };
    const config = new Config(
      {
        csp: { prod: { policies: initial } },
      },
      undefined,
      validatePolicies
    );
    return { initial, config };
  }

  it("should not update policies", async () => {
    const { initial, config } = fixture();
    config.addPolicies({ default: { invalid: null } });

    expect(config.policies).toStrictEqual(initial);
  });

  it("should return an array", async () => {
    const { config } = fixture();
    const errors = config.addPolicies({ default: { invalid: null } });

    expect(Array.isArray(errors)).toBe(true);
  });

  it("should return one error", async () => {
    const { config } = fixture();
    const errors = config.addPolicies({ default: { invalid: null } });

    expect(errors).toHaveLength(1);
  });

  it("should return the error in an expected format", async () => {
    const { config } = fixture();
    const errors = config.addPolicies({ default: { invalid: null } });

    expect(errors).toMatchSnapshot();
  });
});

describe("given two invalid policies", () => {
  function fixture() {
    const initial = {
      default: {
        directives: {
          "default-src": ["'self'"],
        },
      },
    };

    const added = [
      { default: { invalid: null } },
      { "foo/index.html": { invalid: null } },
    ];

    const config = new Config(
      {
        csp: { prod: { policies: initial } },
      },
      undefined,
      validatePolicies
    );

    return { initial, config, added };
  }

  it("should not update policies", async () => {
    const { initial, config, added } = fixture();
    config.addPolicies(...added);
    expect(config.policies).toMatchObject(initial);
  });

  it("should return an array", async () => {
    const { config, added } = fixture();
    const errors = config.addPolicies(...added);
    expect(Array.isArray(errors)).toBe(true);
  });

  it("should return two errors", async () => {
    const { config, added } = fixture();
    const errors = config.addPolicies(...added);
    expect(errors).toHaveLength(2);
  });

  it("should return the errors in an expected format", async () => {
    const { config, added } = fixture();
    const errors = config.addPolicies(...added);
    expect(errors).toMatchSnapshot();
  });
});

describe("given an empty object", () => {
  it("should not update policies", async () => {
    const initial = {
      default: {
        directives: {
          "default-src": ["'self'"],
        },
      },
    };

    const config = new Config({
      csp: { prod: { policies: initial } },
    });
    config.addPolicies({});

    expect(config.policies).toMatchObject(initial);
  });

  it("should return an empty list", async () => {
    const initial = {
      default: {
        directives: {
          "default-src": ["'self'"],
        },
      },
    };

    const errors = new Config({
      csp: { prod: { policies: initial } },
    }).addPolicies({});

    expect(errors).toStrictEqual([]);
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
    });

    config.addPolicies(added);

    expect(config.policies).toMatchObject(expected);
  });

  it("should return an empty list", async () => {
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

    const errors = new Config({
      csp: { prod: { policies: initial } },
    }).addPolicies(added);

    expect(errors).toStrictEqual([]);
  });
});

describe("given a new policy with an existing path", () => {
  describe("and mode=merge", () => {
    function fixture() {
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
      return { initial, added, expected };
    }

    it("should merge it with the policy of the same path", async () => {
      const { initial, added, expected } = fixture();
      const config = new Config({
        csp: { mode: "merge", prod: { policies: initial } },
      });
      config.addPolicies(added);

      expect(config.policies).toMatchObject(expected);
    });

    it("shoudl return an empty errors list", async () => {
      const { initial, added } = fixture();
      const errors = new Config({
        csp: { mode: "merge", prod: { policies: initial } },
      }).addPolicies(added);

      expect(errors).toStrictEqual([]);
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
    });
    config.addPolicies(added1);
    config.addPolicies(added2, added3);

    expect(config.policies).toMatchObject(expected);
  });
});
