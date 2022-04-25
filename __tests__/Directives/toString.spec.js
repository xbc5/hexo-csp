"use strict";

const Directives = require("../../lib/Directives");

describe("given a single directive", () => {
  it("should return it as a string", async () => {
    const a = {
      "default-src": ["https://foo.com"],
    };
    expect(Directives.toString(a)).toBe("default-src https://foo.com");
  });
});

describe("given one directive, two sources", () => {
  it("should return it as a string with both sources", async () => {
    const a = {
      "default-src": ["https://foo.com", "https://bar.com"],
    };
    expect(Directives.toString(a)).toBe(
      "default-src https://foo.com https://bar.com"
    );
  });
});

describe("given two directives, one source each", () => {
  it("should return 'directive source; directive source' ", async () => {
    const a = {
      "default-src": ["https://foo.com"],
      "img-src": ["https://bar.com"],
    };
    expect(Directives.toString(a)).toBe(
      "default-src https://foo.com; img-src https://bar.com"
    );
  });
});

describe("given two directives, two sources each", () => {
  it("should return 'directive source souce; directive source source' ", async () => {
    const a = {
      "default-src": ["https://foo-src.com", "https://bar-src.com"],
      "img-src": ["https://foo-img.com", "https://bar-img.com"],
    };
    expect(Directives.toString(a)).toBe(
      "default-src https://foo-src.com https://bar-src.com; img-src https://foo-img.com https://bar-img.com"
    );
  });
});

describe('given sources with "double quotes"', () => {
  it("should replace them with 'single quotes'", async () => {
    const a = {
      "default-src": ['"self"'],
      "img-src": ['"self"'],
    };
    expect(Directives.toString(a)).toBe("default-src 'self'; img-src 'self'");
  });
});

["self", "none"].forEach((token) => {
  describe(`given ${token} as a source`, () => {
    describe("without quotations", () => {
      it("should surround it with 'single quotes'", async () => {
        const a = {
          "default-src": [token],
          "img-src": [token],
        };
        expect(Directives.toString(a)).toBe(
          `default-src '${token}'; img-src '${token}'`
        );
      });
    });

    describe("with 'single quotations'", () => {
      it("should leave it alone", async () => {
        const a = {
          "default-src": [`'${token}'`],
          "img-src": [`${token}`],
        };
        expect(Directives.toString(a)).toBe(
          `default-src '${token}'; img-src '${token}'`
        );
      });
    });

    describe("as part of a larger word", () => {
      it("should leave it alone", async () => {
        const a = {
          "default-src": [`https://${token}.com`],
        };
        expect(Directives.toString(a)).toBe(`default-src https://${token}.com`);
      });
    });
  });
});
