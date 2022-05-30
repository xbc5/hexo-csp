const fc = require("fast-check");
const { assert } = require("../helpers/properties");
const Directives = require("../../lib/Directives");

const GOOD = [
  "self",
  "none",
  "script",
  "unsafe-eval",
  "usafe-inline",
  "strict-dynamic",
  "unsafe-hashes",
];

GOOD.forEach((val) => {
  describe("valid values", () => {
    it(`should accept '${val}'`, () => {
      expect(Directives.needsQuotes(val)).toBe(true);
    });
  });
});

it("should reject invalid values", () => {
  assert(fc.anything(), (val) => {
    fc.pre(!GOOD.includes(val));
    expect(Directives.needsQuotes(val)).toBe(false);
  });
});

it("should reject invalid strings", () => {
  assert(fc.string(), (val) => {
    fc.pre(!GOOD.includes(val));
    expect(Directives.needsQuotes(val)).toBe(false);
  });
});
