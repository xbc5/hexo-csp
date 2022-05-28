const { Hash } = require("../../lib/crypto");

// WARN: DO NOT MODIFY THIS STRING
// tests will compute a hash from it, including spaces and newlines.
// prettier-ignore-start
WITH_SPACES = `
      div {
        foo: bar;
      }
    `;
// prettier-ignore-end

it("should throw given an invalid algo", () => {
  expect(() => new Hash("foo", "invalid-algo")).toThrow();
});

[
  {
    input: "foo",
    expected: "LCa0a2j/xo/5m0U8HTBBNBNCLXBkg7+g+YpeiGJm564=",
    algo: "sha256",
  },
  {
    input: WITH_SPACES,
    expected: "9jCCsqT/TAZP+1MUnbnNa4nHy2w3Xh4zEIlU64R3qfg=",
    algo: "sha256",
    inputDesc: "a CSS class with spaces",
  },
  {
    // this one is lifted from: https://content-security-policy.com/hash/, and is
    // therefore known to work.
    input: "doSomething();",
    expected: "RFWPLDbv2BY+rCkDzsE+0fr8ylGr2R2faWMhq4lfEQc=",
    algo: "sha256",
  },
  {
    input: "foo",
    expected:
      "mMEf/f3VQGdrGhN8saIrKnA1DJpEFx1rEYDGvly7LuP3nVMsih3Z7y6OCOdSo7q7",
    algo: "sha384",
  },
  {
    input: WITH_SPACES,
    expected:
      "m4Dma+VyH3z8upKe/aLupKOERNV4Bx2U+z0ge71oa/ahoMYnBvF51QXLhWaL6oq7",
    algo: "sha384",
    inputDesc: "a CSS class with spaces",
  },
  {
    input: "foo",
    expected:
      "9/u6bgY2+JDlb7vzKD5STG+jIErimDgtYkdB0NxmODJuKCxBvl5CVNiCB3LFUYosWowMf37aGVlKfrU5RT4e1w==",
    algo: "sha512",
  },
  {
    input: WITH_SPACES,
    expected:
      "EIZpLl102xbRzxKtnO3d1utkm+DRUlyGwi/PYcm+IQFhMsI2Ut0HVyD9XLp5gfhLhJCBUlVnfDW4m4T5VRs5zQ==",
    algo: "sha512",
    inputDesc: "a CSS class with spaces",
  },
].forEach(({ input, expected, algo, inputDesc }) => {
  const inputMsg = inputDesc ? `<<${inputDesc}>>` : input;
  describe(`for hash.generate()`, () => {
    describe(`when algo="${algo}"`, () => {
      it(`should correctly hash+base64 when input="${inputMsg}"`, () => {
        const hash = new Hash(input, algo);
        expect(hash.generate()).toBe(expected);
      });
    });
  });
});
