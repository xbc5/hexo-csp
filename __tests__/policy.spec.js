const Policy = require("../lib/policy");

const DEFAULT_MODE = "merge";

describe("for Policy.mode", () => {
  it("should return the provided value: replace", async () => {
    const fm = new Policy("foo/index.html", { mode: "replace" });
    expect(fm.mode).toBe("replace");
  });

  it("should return the provided value: merge", async () => {
    const fm = new Policy("foo/index.html", { mode: "merge" });
    expect(fm.mode).toBe("merge");
  });

  it("should return the default value when no object passed in", async () => {
    const fm = new Policy("foo/index.html");
    expect(fm.mode).toBe(DEFAULT_MODE);
  });

  it("should return the default value when no mode passed in", async () => {
    const fm = new Policy("foo/index.html", {});
    expect(fm.mode).toBe(DEFAULT_MODE);
  });
});

describe("for Policy.directives", () => {
  it("should return an empty object when no directives provided", async () => {
    const fm = new Policy("foo/index.html", {});
    expect(fm.directives).toStrictEqual({});
  });

  it("should return the provided directives", async () => {
    const fm = new Policy("foo/index.html", {
      "default-src": ["'self'"],
      "img-src": ["https://foo.com"],
    });
    expect(fm.directives).toStrictEqual({
      "default-src": ["'self'"],
      "img-src": ["https://foo.com"],
    });
  });

  it("should exclude anything specified as not a directive", async () => {
    const fm = new Policy(
      "foo/index.html",
      { "default-src": ["'self'"], foo: "foo" },
      ["foo"]
    );
    expect(fm.directives).toStrictEqual({
      "default-src": ["'self'"],
    });
  });

  it("should exclude the provided default non-directives", async () => {
    const fm = new Policy("foo/index.html", {
      "default-src": ["'self'"],
      mode: "replace",
    });
    expect(fm.directives).toStrictEqual({
      "default-src": ["'self'"],
    });
  });
});

describe("for Policy.path", () => {
  it("should return the provided value", async () => {
    const p = new Policy("foo/index.html");
    expect(p.path).toBe("foo/index.html");
  });
});
