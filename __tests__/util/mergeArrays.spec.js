const { mergeArrays } = require("../../lib/util");

describe("when giving mergeArrays() three sources", () => {
  it("should merge them into one without dupes", async () => {
    const a = ["'self'", "https://foo.com"];
    const b = ["'self'", "https://bar.com"];
    const c = ["https://bar.com", "https://baz.com/", "http://foobar.net"];

    expect(mergeArrays(a, b, c)).toStrictEqual([
      "'self'",
      "https://foo.com",
      "https://bar.com",
      "https://baz.com/",
      "http://foobar.net",
    ]);
  });
});

describe("when giving mergeArrays() undefined values", () => {
  it("should handle them silenty -- essentially ignoring them", async () => {
    const a = ["'self'", "https://foo.com"];
    const b = undefined;
    const c = undefined;
    const d = ["https://baz.com/", "http://foobar.net"];

    expect(mergeArrays(a, b, c, d)).toStrictEqual([
      "'self'",
      "https://foo.com",
      "https://baz.com/",
      "http://foobar.net",
    ]);
  });
});
