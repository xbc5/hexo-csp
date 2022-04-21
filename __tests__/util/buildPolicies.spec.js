"use strict";

const { buildPolicies } = require("../../lib/util");

describe("given mode=merge", () => {
  describe("for non-colliding paths", () => {
    it("should return two policies", async () => {
      const a = {
        default: {
          mode: "merge",
          directives: {
            "default-src": ["https://default-default.com"],
          },
        },
      };
      const b = {
        "foo/index.html": {
          mode: "merge",
          directives: {
            "default-src": ["https://foo-default.com"],
          },
        },
      };
      const expected = {
        default: {
          mode: "merge",
          directives: {
            "default-src": ["https://default-default.com"],
          },
        },
        "foo/index.html": {
          mode: "merge",
          directives: {
            "default-src": ["https://foo-default.com"],
          },
        },
      };

      expect(buildPolicies(a, b)).toStrictEqual(expected);
    });
  });

  describe("for colliding paths", () => {
    it("should merge source values (arrays)", async () => {
      const a = {
        default: {
          mode: "merge",
          directives: {
            "default-src": ["https://default1-default.com"],
          },
        },
      };
      const b = {
        default: {
          mode: "merge",
          directives: {
            "default-src": ["https://default2-default.com"],
          },
        },
      };
      const expected = {
        default: {
          mode: "merge",
          directives: {
            "default-src": [
              "https://default1-default.com",
              "https://default2-default.com",
            ],
          },
        },
      };

      expect(buildPolicies(a, b)).toStrictEqual(expected);
    });

    it("should remove duplicate source values", async () => {
      const a = {
        default: {
          mode: "merge",
          directives: {
            "default-src": [
              "https://default1-default.com",
              "https://default1-default.com",
            ],
          },
        },
      };
      const b = {
        default: {
          mode: "merge",
          directives: {
            "default-src": ["https://default1-default.com"],
          },
        },
      };
      const expected = {
        default: {
          mode: "merge",
          directives: {
            "default-src": ["https://default1-default.com"],
          },
        },
      };

      expect(buildPolicies(a, b)).toStrictEqual(expected);
    });
  });

  describe("for multiple directives", () => {
    it("should merge them for same paths", async () => {
      const a = {
        default: {
          mode: "merge",
          directives: {
            "default-src": ["https://default1-default.com"],
          },
        },
        "foo/index.html": {
          mode: "merge",
          directives: {
            "default-src": ["https://foo1-default.com"],
            "img-src": ["https://foo1-img.com"],
          },
        },
      };
      const b = {
        default: {
          mode: "merge",
          directives: {
            "img-src": ["https://default2-img.com"],
          },
        },
        "foo/index.html": {
          mode: "merge",
          directives: {
            "default-src": ["https://foo2-default.com"],
            "img-src": ["https://foo2-img.com"],
          },
        },
      };
      const expected = {
        default: {
          mode: "merge",
          directives: {
            "default-src": ["https://default1-default.com"],
            "img-src": ["https://default2-img.com"],
          },
        },
        "foo/index.html": {
          mode: "merge",
          directives: {
            "default-src": [
              "https://foo1-default.com",
              "https://foo2-default.com",
            ],
            "img-src": ["https://foo1-img.com", "https://foo2-img.com"],
          },
        },
      };

      expect(buildPolicies(a, b)).toStrictEqual(expected);
    });
  });

  describe("for both colliding and non-colliding paths", () => {
    it("should merge sources for same path only", async () => {
      const a = {
        default: {
          mode: "merge",
          directives: {
            "default-src": ["https://default1-default.com"],
          },
        },
        "foo/index.html": {
          mode: "merge",
          directives: {
            "default-src": ["https://foo-default.com"],
          },
        },
      };

      const b = {
        default: {
          mode: "merge",
          directives: {
            "default-src": ["https://default2-default.com"],
          },
        },
        "bar/index.html": {
          mode: "merge",
          directives: {
            "default-src": ["https://bar-default.com"],
          },
        },
      };

      const expected = {
        default: {
          mode: "merge",
          directives: {
            "default-src": [
              "https://default1-default.com",
              "https://default2-default.com",
            ],
          },
        },
        "foo/index.html": {
          mode: "merge",
          directives: {
            "default-src": ["https://foo-default.com"],
          },
        },
        "bar/index.html": {
          mode: "merge",
          directives: {
            "default-src": ["https://bar-default.com"],
          },
        },
      };

      expect(buildPolicies(a, b)).toStrictEqual(expected);
    });
  });
});
