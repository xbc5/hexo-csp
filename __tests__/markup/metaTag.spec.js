"use strict";

const { metaTag } = require("../../lib/markup");

describe("given a string", () => {
  it("should include it within a meta tags contents", async () => {
    const expected =
      `<meta http-equiv="Content-Security-Policy" ` +
      `content="default-src 'self'; img-src https://foo.com">`;

    const result = metaTag("default-src 'self'; img-src https://foo.com");

    expect(result).toBe(expected);
  });
});
