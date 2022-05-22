const { factory } = require("./util");

const initial = () => [
  {
    pattern: "^foo$",
    mode: "merge",
    directives: {
      "default-src": ["https://default-foo-base.com"],
      "img-src": ["https://img-foo-base.com"],
    },
  },
  {
    pattern: "^bar$",
    mode: "merge",
    directives: {
      "default-src": ["https://default-bar-base.com"],
      "img-src": ["https://img-bar-base.com"],
    },
  },
];

const toMerge = () => ({
  pattern: "^bar$",
  mode: "merge",
  directives: {
    "default-src": ["https://default-bar-arg.com"],
    "img-src": ["https://img-bar-arg.com"],
  },
});

const toReplace = () => ({
  pattern: "^foo$",
  mode: "replace",
  directives: {
    "default-src": ["https://default-foo-arg.com"],
    "img-src": ["https://img-foo-arg.com"],
  },
});
const expectedReplace = () => [
  {
    pattern: "^foo$",
    mode: "replace",
    directives: {
      "default-src": ["https://default-foo-arg.com"],
      "img-src": ["https://img-foo-arg.com"],
    },
  },
  {
    pattern: "^bar$",
    mode: "merge",
    directives: {
      "default-src": ["https://default-bar-base.com"],
      "img-src": ["https://img-bar-base.com"],
    },
  },
];

const expectedMerge = () => [
  {
    pattern: "^foo$",
    mode: "merge",
    directives: {
      "default-src": ["https://default-foo-base.com"],
      "img-src": ["https://img-foo-base.com"],
    },
  },
  {
    pattern: "^bar$",
    mode: "merge",
    directives: {
      "default-src": [
        "https://default-bar-base.com",
        "https://default-bar-arg.com",
      ],
      "img-src": ["https://img-bar-base.com", "https://img-bar-arg.com"],
    },
  },
];

it("should exist", async () => {
  const result = factory().combinePolicy;
  expect(result).toBeDefined();
});

it("should clone policies", async () => {
  const a = initial();
  const b = factory({ initial: a }).combinePolicy(toMerge());

  b.map((policy) => {
    policy.pattern = "changed";
    policy.directives.changed = null; // directives is nested object, check these too
    policy.directives["default-src"].push("changed");
    return policy;
  });

  const patterns = a.filter((p) => p.pattern === "changed");
  expect(patterns).toHaveLength(0);

  const directives = a.filter((p) => p.directives.changed === null);
  expect(directives).toHaveLength(0);

  const hasDirective =
    a.filter((p) => p.directives["default-src"].includes("changed")).length > 0;
  expect(hasDirective).toBe(false);
});

["merge", "replace"].forEach((mode) => {
  describe(`for the subject`, () => {
    it(`should clone the it when mode=${mode}`, async () => {
      const a = toMerge();
      a.mode = mode;
      const b = factory({ initial: initial() }).combinePolicy(a);

      a.pattern = "changed";
      a.directives.changed = null;
      a.directives["default-src"].push("changed");

      const patterns = b.filter((p) => p.pattern === "changed");
      expect(patterns).toHaveLength(0);

      const directives = b.filter((p) => p.directives.changed === null);
      expect(directives).toHaveLength(0);

      const changed = (p) => p.directives["default-src"].includes("changed");
      const hasDirective = b.filter(changed).length > 0;
      expect(hasDirective).toBe(false);
    });
  });
});

["merge", "replace"].forEach((mode) => {
  describe(`when mode=${mode}`, () => {
    it(`should not include mode in the result`, async () => {
      const policies = factory({ initial: initial() });

      const result = policies
        .combinePolicy(toMerge())
        .filter((p) => p.mode !== undefined);

      expect(result).toHaveLength(0);
    });
  });
});

describe("when mode=merge", () => {
  it("should maintain the same patterns", async () => {
    const expected = [{ pattern: "^foo$" }, { pattern: "^bar$" }];
    const policies = factory({ initial: initial() });

    const result = policies.combinePolicy(toMerge());

    expect(result).toMatchObject(expected);
  });

  it("should merge the directives", async () => {
    const expected = expectedMerge().map((expected) => ({
      directives: expected.directives,
    }));
    const policies = factory({ initial: initial() });

    const result = policies.combinePolicy(toMerge());

    expect(result).toMatchObject(expected);
  });
});

describe("when mode=replace", () => {
  it("should maintain the same patterns", async () => {
    const expected = [{ pattern: "^foo$" }, { pattern: "^bar$" }];
    const policies = factory({ initial: initial() });

    const result = policies.combinePolicy(toReplace());

    expect(result).toMatchObject(expected);
  });

  it("should replace the directives", async () => {
    const expected = expectedReplace().map((expected) => ({
      directives: expected.directives,
    }));
    const policies = factory({ initial: initial() });

    const result = policies.combinePolicy(toReplace());

    expect(result).toMatchObject(expected);
  });
});

describe("when the path doesn't match", () => {
  it("should append it to policies", async () => {
    const arg = {
      ...toMerge(),
      pattern: "^other$",
      directives: { ["default-src"]: ["https://added.com"] },
    };

    const result = factory({ initial: initial() }).combinePolicy(arg);
    expect(result).toMatchSnapshot();
  });
});
