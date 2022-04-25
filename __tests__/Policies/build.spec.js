"use strict";

const Policies = require("../../lib/Policies");
const { defined } = require("../../lib/util");

function msg(args) {
  return args.map((a) => {
    if (a === null) return "null";
    if (a === undefined) return "undefined";
    return "policy";
  });
}

// TODO: test nullish values
describe("given nullish values", () => {
  const policy = {
    default: {
      directives: {
        "default-src": ["https://default-default.com"],
      },
    },
  };

  [
    [undefined],
    [null],
    [undefined, undefined],
    [null, null],
    [null, undefined],
    [policy, undefined],
    [undefined, policy],
    [policy, undefined, undefined],
    [policy, null, null],
    [policy, null, undefined],
    [policy, undefined, null],
    [undefined, policy, null],
    [undefined, null, policy],
    [policy, null, policy],
    [policy, undefined, policy],
    [null, policy, policy],
  ].forEach((args) => {
    it(`should ignore: ${msg(args)}`, () => {
      let expected = args.filter(defined);
      if (expected.length === 0) expected = [{}];

      const result = Policies.build(...args);
      expect(result).toStrictEqual(...expected);
    });
  });
});

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
          directives: {
            "default-src": ["https://default-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "default-src": ["https://foo-default.com"],
          },
        },
      };

      expect(Policies.build(a, b)).toStrictEqual(expected);
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
          directives: {
            "default-src": [
              "https://default1-default.com",
              "https://default2-default.com",
            ],
          },
        },
      };

      expect(Policies.build(a, b)).toStrictEqual(expected);
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
          directives: {
            "default-src": ["https://default1-default.com"],
          },
        },
      };

      expect(Policies.build(a, b)).toStrictEqual(expected);
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
          directives: {
            "default-src": ["https://default1-default.com"],
            "img-src": ["https://default2-img.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "default-src": [
              "https://foo1-default.com",
              "https://foo2-default.com",
            ],
            "img-src": ["https://foo1-img.com", "https://foo2-img.com"],
          },
        },
      };
      const result = Policies.build(a, b);
      expect(result).toStrictEqual(expected);
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
          directives: {
            "default-src": [
              "https://default1-default.com",
              "https://default2-default.com",
            ],
          },
        },
        "foo/index.html": {
          directives: {
            "default-src": ["https://foo-default.com"],
          },
        },
        "bar/index.html": {
          directives: {
            "default-src": ["https://bar-default.com"],
          },
        },
      };

      expect(Policies.build(a, b)).toStrictEqual(expected);
    });
  });
});

describe("given mode=replace", () => {
  describe("for non-colliding paths", () => {
    it("should return two policies", async () => {
      const a = {
        default: {
          mode: "replace",
          directives: {
            "default-src": ["https://default-default.com"],
          },
        },
      };
      const b = {
        "foo/index.html": {
          mode: "replace",
          directives: {
            "default-src": ["https://foo-default.com"],
          },
        },
      };
      const expected = {
        default: {
          directives: {
            "default-src": ["https://default-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "default-src": ["https://foo-default.com"],
          },
        },
      };

      expect(Policies.build(a, b)).toStrictEqual(expected);
    });
  });

  describe("for colliding paths", () => {
    it("should replace source values", async () => {
      const a = {
        default: {
          mode: "replace",
          directives: {
            "default-src": ["https://default1-default.com"],
          },
        },
      };
      const b = {
        default: {
          mode: "replace",
          directives: {
            "default-src": ["https://default2-default.com"],
          },
        },
      };
      const expected = {
        default: {
          directives: {
            "default-src": ["https://default2-default.com"],
          },
        },
      };

      expect(Policies.build(a, b)).toStrictEqual(expected);
    });
  });

  describe("for both colliding and non-colliding paths", () => {
    it("should replace sources for same path only", async () => {
      const a = {
        default: {
          mode: "replace",
          directives: {
            "default-src": ["https://default1-default.com"],
          },
        },
        "foo/index.html": {
          mode: "replace",
          directives: {
            "default-src": ["https://foo-default.com"],
          },
        },
      };

      const b = {
        default: {
          mode: "replace",
          directives: {
            "default-src": ["https://default2-default.com"],
          },
        },
        "bar/index.html": {
          mode: "replace",
          directives: {
            "default-src": ["https://bar-default.com"],
          },
        },
      };

      const expected = {
        default: {
          directives: {
            "default-src": ["https://default2-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "default-src": ["https://foo-default.com"],
          },
        },
        "bar/index.html": {
          directives: {
            "default-src": ["https://bar-default.com"],
          },
        },
      };

      expect(Policies.build(a, b)).toStrictEqual(expected);
    });
  });
});

describe("given mixed mode=replace|merge and multiple policies", () => {
  describe("for a=merge, b=replace, c=merge, d=replace", () => {
    it("should d ==[replace]=> c,b,a", async () => {
      const a = {
        default: {
          mode: "merge",
          directives: {
            "default-src": ["https://a-default-default-1.com"],
          },
        },
        "foo/index.html": {
          mode: "merge",
          directives: {
            "default-src": ["https://a-foo-default-default-1.com"],
            "img-src": ["https://a-foo-default-img-1.com"],
          },
        },
      };
      const b = {
        default: {
          mode: "replace",
          directives: {
            "default-src": [
              "https://b-default-default-1.com",
              "https://b-default-default-2.com",
            ],
          },
        },
        "foo/index.html": {
          mode: "replace",
          directives: {
            "default-src": ["https://b-foo-default-default-1.com"],
          },
        },
      };
      const c = {
        "bar/index.html": {
          mode: "replace",
          directives: {
            "default-src": ["https://c-bar-default.com"],
          },
        },
      };
      const d = {
        default: {
          mode: "merge",
          directives: {
            "default-src": [
              "https://d-default-default-1.com",
              "https://d-default-default-2.com",
            ],
          },
        },
        "bar/index.html": {
          mode: "merge",
          directives: {
            "default-src": ["https://d-bar-default-1.com"],
          },
        },
      };
      const expected = {
        default: {
          directives: {
            "default-src": [
              "https://b-default-default-1.com",
              "https://b-default-default-2.com",
              "https://d-default-default-1.com",
              "https://d-default-default-2.com",
            ],
          },
        },
        "bar/index.html": {
          directives: {
            "default-src": [
              "https://c-bar-default.com",
              "https://d-bar-default-1.com",
            ],
          },
        },
        "foo/index.html": {
          directives: {
            "default-src": ["https://b-foo-default-default-1.com"],
          },
        },
      };

      const result = Policies.build(a, b, c, d);

      expect(result).toStrictEqual(expected);
    });
  });

  describe("for colliding paths", () => {
    it("should replace source values", async () => {
      const a = {
        default: {
          mode: "replace",
          directives: {
            "default-src": ["https://default1-default.com"],
          },
        },
      };
      const b = {
        default: {
          mode: "replace",
          directives: {
            "default-src": ["https://default2-default.com"],
          },
        },
      };
      const expected = {
        default: {
          directives: {
            "default-src": ["https://default2-default.com"],
          },
        },
      };

      expect(Policies.build(a, b)).toStrictEqual(expected);
    });
  });

  describe("for both colliding and non-colliding paths", () => {
    it("should replace sources for same path only", async () => {
      const a = {
        default: {
          mode: "replace",
          directives: {
            "default-src": ["https://default1-default.com"],
          },
        },
        "foo/index.html": {
          mode: "replace",
          directives: {
            "default-src": ["https://foo-default.com"],
          },
        },
      };

      const b = {
        default: {
          mode: "replace",
          directives: {
            "default-src": ["https://default2-default.com"],
          },
        },
        "bar/index.html": {
          mode: "replace",
          directives: {
            "default-src": ["https://bar-default.com"],
          },
        },
      };

      const expected = {
        default: {
          directives: {
            "default-src": ["https://default2-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "default-src": ["https://foo-default.com"],
          },
        },
        "bar/index.html": {
          directives: {
            "default-src": ["https://bar-default.com"],
          },
        },
      };

      expect(Policies.build(a, b)).toStrictEqual(expected);
    });
  });
});
