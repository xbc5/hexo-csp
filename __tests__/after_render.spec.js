"use strict";
const { fixture } = require("./helpers/mock");

describe("given mixed mode policies and env=prod", () => {
  ["markdown-1", "markdown-2", "/"].forEach((name) => {
    describe(`for ${name}`, () => {
      it("should merge and render the given policies", async () => {
        const render = await fixture("mixed-mode-prod");
        expect(await render(name)).toMatchSnapshot();
      });
    });
  });
});

describe("given mixed mode policies and env=dev", () => {
  ["markdown-1", "markdown-2", "/"].forEach((name) => {
    describe(`for ${name}`, () => {
      it("should merge and render the given policies", async () => {
        const render = await fixture("mixed-mode-dev");
        expect(await render(name)).toMatchSnapshot();
      });
    });
  });
});

describe("given replace mode policies and env=dev", () => {
  ["markdown-1", "markdown-2", "/"].forEach((name) => {
    describe(`for ${name}`, () => {
      it("should replace where appropriate and render the given policies", async () => {
        const render = await fixture("replace-mode-dev");
        expect(await render(name)).toMatchSnapshot();
      });
    });
  });
});

describe("given invalid frontmatter", () => {
  ["markdown-1", "/"].forEach((name) => {
    describe(`for ${name}`, () => {
      it("should not render a CSP", async () => {
        const render = await fixture("invalid-frontmatter");
        expect(await render(name)).toMatchSnapshot();
      });
    });
  });
});
