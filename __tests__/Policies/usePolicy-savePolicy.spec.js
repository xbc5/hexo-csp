const { factory } = require("./util");

const initial = () => [
  {
    pattern: "^foo$",
    directives: {
      "default-src": ["https://default-foo-base.com"],
      "img-src": ["https://img-foo-base.com"],
    },
  },
  {
    pattern: "^bar$",
    directives: {
      "default-src": ["https://default-bar-base.com"],
      "img-src": ["https://img-bar-base.com"],
    },
  },
];

const arg = () => ({
  pattern: "^foo$",
  prod: {
    mode: "replace",
    directives: {
      "img-src": ["https://prod-img-foo-arg.com"],
      "default-src": ["https://prod-default-foo-arg.com"],
    },
  },
  dev: {
    mode: "merge",
    directives: {
      "img-src": ["https://dev-img-foo-arg.com"],
      "default-src": ["https://dev-default-foo-arg.com"],
    },
  },
});

["usePolicy", "savePolicy"].forEach((method) => {
  describe(`for ${method}()`, () => {
    it("should be defined", async () => {
      expect(factory()[method]).toBeDefined();
    });

    describe("given a policy with dev(merge); prod(replace)", () => {
      it("should merge (^foo$) dev into prod, and replace foo", async () => {
        const a = arg();
        a.dev.mode = "merge";
        a.prod.mode = "replace";

        const expected = [
          {
            pattern: "^foo$",
            directives: {
              "img-src": [
                "https://prod-img-foo-arg.com",
                "https://dev-img-foo-arg.com",
              ],
              "default-src": [
                "https://prod-default-foo-arg.com",
                "https://dev-default-foo-arg.com",
              ],
            },
          },
          {
            pattern: "^bar$",
            directives: {
              "default-src": ["https://default-bar-base.com"],
              "img-src": ["https://img-bar-base.com"],
            },
          },
        ];
        const result = factory({ initial: initial() })[method](a, true);
        expect(result).toStrictEqual(expected);
      });
    });

    describe("given a policy with dev(replace); prod(merge)", () => {
      it("should use dev policies exclusively", async () => {
        const a = arg();
        a.dev.mode = "replace";
        a.prod.mode = "merge";

        const expected = [
          {
            pattern: "^foo$",
            directives: {
              "img-src": ["https://dev-img-foo-arg.com"],
              "default-src": ["https://dev-default-foo-arg.com"],
            },
          },
          {
            pattern: "^bar$",
            directives: {
              "default-src": ["https://default-bar-base.com"],
              "img-src": ["https://img-bar-base.com"],
            },
          },
        ];

        const result = factory({ initial: initial() })[method](a, true);
        expect(result).toStrictEqual(expected);
      });
    });

    describe("when env=prod", () => {
      it("should ignore dev policies", async () => {
        const a = arg();
        a.dev.mode = "replace";
        a.prod.mode = "replace";

        const expected = [
          {
            pattern: "^foo$",
            directives: {
              "img-src": ["https://prod-img-foo-arg.com"],
              "default-src": ["https://prod-default-foo-arg.com"],
            },
          },
          {
            pattern: "^bar$",
            directives: {
              "default-src": ["https://default-bar-base.com"],
              "img-src": ["https://img-bar-base.com"],
            },
          },
        ];
        const opts = { env: "prod", initial: initial() };
        const result = factory(opts)[method](arg(), true);
        expect(result).toMatchObject(expected);
      });
    });

    describe("when path doesn't match", () => {
      it("should append it to policies, instead of replacing", async () => {
        const a = arg();
        a.pattern = "^added$";
        const result = factory({ initial: initial() })[method](a, true);
        expect(result).toMatchSnapshot();
      });
    });

    it("should return a clone", async () => {
      const a = arg();
      const policies = factory({ initial: initial() });
      const result = policies[method](a, true);

      result.map((policy) => {
        policy.pattern = "changed";
        policy.directives.changed = null; // directives is nested object, check these too
        policy.directives["default-src"].push("changed");
        return policy;
      });

      expect(a.dev.pattern === "changed").toBe(false);
      expect(a.prod.pattern === "changed").toBe(false);
      expect(a.dev.directives.changed).not.toBeNull();
      expect(a.prod.directives.changed).not.toBeNull();

      const hasDirective = (env) =>
        a[env].directives["default-src"].includes("changed");
      expect(hasDirective("prod")).toBe(false);
      expect(hasDirective("dev")).toBe(false);
    });
  });
});

describe("for savePolicy()", () => {
  it("should save the result to policies", async () => {
    const a = arg();
    a.pattern = "^added$";
    const policies = factory({ initial: initial() });
    const result = policies.savePolicy(a, true);
    expect(result).toStrictEqual(policies.policies);
  });
});

describe("for usePolicy()", () => {
  it("should not save the result to policies", async () => {
    const a = arg();
    a.pattern = "^added$";
    const policies = factory({ initial: initial() });
    policies.usePolicy(a, true);
    expect(policies.policies).toStrictEqual(initial());
  });
});
