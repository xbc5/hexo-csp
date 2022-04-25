"use strict";

const DefaultPolicy = require("../lib/DefaultPolicy");

describe("fromPolicy()", () => {
  describe(" for mode", () => {
    it("should keep the value provided", async () => {
      const p = { mode: "replace" };
      const result = DefaultPolicy.fromPolicy(p);
      expect(result).toMatchObject(p);
    });

    it('should default to "merge"', async () => {
      const result = DefaultPolicy.fromPolicy({});
      expect(result).toMatchObject({ mode: "merge" });
    });
  });

  describe("for directives", () => {
    it("should keep the value provided", async () => {
      const p = { directives: { "default-src": "'self'" } };
      const result = DefaultPolicy.fromPolicy(p);
      expect(result).toMatchObject(p);
    });

    it('should default to "{}"', async () => {
      const result = DefaultPolicy.fromPolicy({});
      expect(result).toMatchObject({ directives: {} });
    });
  });
});

describe("fromArray()", () => {
  describe("for a single policy", () => {
    describe("mode", () => {
      it("should keep the value provided", async () => {
        const policy = { mode: "replace" };
        const result = DefaultPolicy.fromArray(policy);
        expect(result).toMatchObject([policy]);
      });

      it('should default to "merge"', async () => {
        const result = DefaultPolicy.fromArray([{}]);
        expect(result).toMatchObject([{ mode: "merge" }]);
      });
    });

    describe("directives", () => {
      it("should keep the value provided", async () => {
        const policy = { directives: { "default-src": "'self'" } };
        const result = DefaultPolicy.fromArray(policy);
        expect(result).toMatchObject([policy]);
      });

      it('should default to "{}"', async () => {
        const policy = { directives: undefined };
        const result = DefaultPolicy.fromArray(policy);
        expect(result).toMatchObject([{ directives: {} }]);
      });
    });
  });

  describe("for multiple policies", () => {
    describe("mode", () => {
      it("should keep the value provided, and set default where necessary", async () => {
        const policies = [{ mode: "replace" }, {}];
        const expected = [{ mode: "replace" }, { mode: "merge" }];
        const result = DefaultPolicy.fromArray(...policies);
        expect(result).toMatchObject(expected);
      });

      it('should default to "merge"', async () => {
        const result = DefaultPolicy.fromArray({}, {});
        expect(result).toMatchObject([{ mode: "merge" }, { mode: "merge" }]);
      });
    });

    describe("directives", () => {
      describe("given a policy with directives, and another with none", () => {
        it("should keep the given values for one, and set defaults for the other", async () => {
          const policies = [
            { directives: { "default-src": "'self'" } },
            { directives: undefined },
          ];

          const expected = [
            { directives: { "default-src": "'self'" } },
            { directives: {} },
          ];
          const result = DefaultPolicy.fromArray(...policies);
          expect(result).toMatchObject(expected);
        });
      });
    });
  });
});

describe("fromEnvs()", () => {
  describe("for multiple envs", () => {
    it("should default mode and directives keys for each env if necessary", async () => {
      const envPolicies = [
        { default: { mode: "replace" }, "bar/index.html": {} },
        {
          "foo/index.html": {
            directives: { "default-src": "https://foo-default.com" },
          },
        },
      ];

      const expected = [
        {
          default: { mode: "replace", directives: {} },
          "bar/index.html": { mode: "merge", directives: {} },
        },
        {
          "foo/index.html": {
            mode: "merge",
            directives: { "default-src": "https://foo-default.com" },
          },
        },
      ];

      const result = DefaultPolicy.fromEnvs(envPolicies);
      expect(result).toMatchObject(expected);
    });
  });
});
