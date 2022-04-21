"use strict";
const { fixture } = require("./helpers/mock");

describe("given frontmatter; mode=merge; env=dev", () => {
  ["markdown-1", "markdown-2", "/"].forEach((name) => {
    describe(`for ${name}`, () => {
      it("should merge and render the given policies", async () => {
        const render = await fixture("frontmatter-merge-dev");
        expect(await render(name)).toMatchSnapshot();
      });
    });
  });
});

describe("given frontmatter; mode=merge; env=prod", () => {
  ["markdown-1", "markdown-2", "/"].forEach((name) => {
    describe(`for ${name}`, () => {
      it("should merge and render the given (production) policies", async () => {
        const render = await fixture("frontmatter-merge-prod");
        expect(await render(name)).toMatchSnapshot();
      });
    });
  });
});
