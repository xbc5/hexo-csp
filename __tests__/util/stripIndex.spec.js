"use strict";

const { stripIndex } = require("../../lib/util");

[
  { given: "/index.html", expected: "/" },
  { given: "index.html", expected: "/" },
  { given: "foo/index.html", expected: "foo" },
  { given: "foo/bar/index.html", expected: "foo/bar" },
  { given: "foo/bar/index.html/index.html", expected: "foo/bar/index.html" },
  { given: "index.html/foo/bar/index.html", expected: "index.html/foo/bar" },
  {
    given: "https://example.com/foo/bar/index.html",
    expected: "https://example.com/foo/bar",
  },
].forEach(({ given, expected }) => {
  describe(`given "${given}"`, () => {
    it(`should strip the index.html to: "${expected}"`, async () => {
      expect(stripIndex(given)).toBe(expected);
    });
  });
});

["index.html/", "index.htm", "index"].forEach((path) => {
  describe(`given "${path}"`, () => {
    it(`should leave the URL untouched"`, async () => {
      expect(stripIndex(path)).toBe(path);
    });
  });
});
