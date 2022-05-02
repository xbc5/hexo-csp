const { Hash } = require("../../lib/crypto");

it("should throw given an invalid algo", () => {
  expect(() => new Hash("foo", "invalid-algo")).toThrow();
});

// sha256: f63082b2a4ff4c064ffb53149db9cd6b89c7cb6c375e1e33108954eb8477a9f8
//
// sha384: 9b80e66be5721f7cfcba929efda2eea4a38444d578071d94fb3d207bbd686bf6
//         a1a0c62706f179d505cb85668bea8abb
//
// sha512: 1086692e5d74db16d1cf12ad9cedddd6eb649be0d1525c86c22fcf61c9be2101
//         6132c23652dd075720fd5cba7981f84b8490815255677c35b89b84f9551b39cd
//
// WARN: DO NOT MODIFY THIS STRING
// tests will compute a hash from it, including spaces and newlines.
// prettier-ignore-start
WITH_SPACES = `
      div {
        foo: bar;
      }
    `;
// prettier-ignore-end

describe("hash()", () => {
  [
    {
      algo: "sha256",
      input: "foo",
      expected:
        "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
      desc: "should hash a simple string correctly",
    },
    {
      algo: "sha256",
      input: WITH_SPACES,
      expected:
        "f63082b2a4ff4c064ffb53149db9cd6b89c7cb6c375e1e33108954eb8477a9f8",
      desc: "should hash a string with newlines and spaces correctly",
    },
    {
      algo: "sha256",
      input: "\n\t\t\n",
      expected:
        "2d15ca90d999b495a220b9dcfab9482a552d63ff397d9dfcd6a1285a57b833a9",
      desc: "should handle newlines and tabs correctly",
    },
    {
      algo: "sha384",
      input: "foo",
      expected:
        "98c11ffdfdd540676b1a137cb1a22b2a70350c9a44171d6b1180c6be5cbb2ee3f79d532c8a1dd9ef2e8e08e752a3babb",
      desc: "should hash a simple string correctly",
    },
    {
      algo: "sha384",
      input: WITH_SPACES,
      expected:
        "9b80e66be5721f7cfcba929efda2eea4a38444d578071d94fb3d207bbd686bf6a1a0c62706f179d505cb85668bea8abb",
      desc: "should hash a string with newlines and spaces correctly",
    },
    {
      algo: "sha384",
      input: "\n\t\t\n",
      expected:
        "86d147bf0badb773b7e29eef5871c2ab58c80b6c46cea0c27134ab18e6ae2f9f3a2efdf2b695532c07a04f1a2c093c93",
      desc: "should handle newlines and tabs correctly",
    },
    {
      algo: "sha512",
      input: "foo",
      expected:
        "f7fbba6e0636f890e56fbbf3283e524c6fa3204ae298382d624741d0dc6638326e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7",
      desc: "should hash a simple string correctly",
    },
    {
      algo: "sha512",
      input: WITH_SPACES,
      expected:
        "1086692e5d74db16d1cf12ad9cedddd6eb649be0d1525c86c22fcf61c9be21016132c23652dd075720fd5cba7981f84b8490815255677c35b89b84f9551b39cd",
      desc: "should hash a string with newlines and spaces correctly",
    },
    {
      algo: "sha512",
      input: "\n\t\t\n",
      expected:
        "3bdba7f24f0a521286d984d287df9fa356f0e80e1c054bcd8114067b5831a7aebf6af4714f2f9bd4ad0f1587b2cd42958480f4db5b595fe63a9aaf2161657320",
      desc: "should handle newlines and tabs correctly",
    },
  ].forEach(({ algo, input, expected, desc }) => {
    describe(`@ ${algo}`, () => {
      it(desc, () => {
        const hash = new Hash(input, algo);
        expect(hash.hash().toString()).toBe(expected);
      });
    });
  });
});

describe("base64()", () => {
  it("should base64 encode the subject", () => {
    const hash = new Hash("foo");
    const expected = "Zm9v";
    expect(hash.base64().toString()).toBe(expected);
  });
});

describe("toString() only", () => {
  it("should return the subject untouched", () => {
    const hash = new Hash("foo");
    expect(hash.toString()).toBe("foo");
  });
});

describe("hash().base64()", () => {
  it("should return the hashed + base64 subject", () => {
    const hash = new Hash("foo", "sha256");
    expected =
      "MmMyNmI0NmI2OGZmYzY4ZmY5OWI0NTNjMWQzMDQxMzQxMzQyMmQ3MDY0ODNiZmEwZjk4YTVlODg2MjY2ZTdhZQ==";
    expect(hash.hash().base64().toString()).toBe(expected);
  });
});

describe("generate()", () => {
  it("should return a fully hashed and encoded value", () => {
    const hash = new Hash("foo", "sha256");
    expected =
      "MmMyNmI0NmI2OGZmYzY4ZmY5OWI0NTNjMWQzMDQxMzQxMzQyMmQ3MDY0ODNiZmEwZjk4YTVlODg2MjY2ZTdhZQ==";
    expect(hash.generate()).toBe(expected);
  });
});
