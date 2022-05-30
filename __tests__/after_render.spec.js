"use strict";
const { fixture } = require("./helpers/mock");
const path = require("path");

describe("given mixed mode policies and env=prod", () => {
  ["markdown-1", "markdown-2", "/"].forEach((name) => {
    describe(`for ${name}`, () => {
      it("should merge and render the given policies", async () => {
        const render = await fixture("mixed-mode-prod", { env: "prod" });
        expect(await render(name)).toMatchSnapshot();
      });
    });
  });
});

describe("given mixed mode policies and env=dev", () => {
  ["markdown-1", "markdown-2", "/"].forEach((name) => {
    describe(`for ${name}`, () => {
      it("should merge and render the given policies", async () => {
        const render = await fixture("mixed-mode-dev", { env: "dev" });
        expect(await render(name)).toMatchSnapshot();
      });
    });
  });
});

// TODO: test prod replace mode
describe("given replace mode policies and env=dev", () => {
  ["markdown-1", "markdown-2", "/"].forEach((name) => {
    describe(`for ${name}`, () => {
      it("should replace where appropriate and render the given policies", async () => {
        const render = await fixture("replace-mode-dev", { env: "dev" });
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

describe("given the custom permalink", () => {
  ["2001/01/01/markdown-1", "/", "page-1/"].forEach((p) => {
    describe(p, () => {
      const basename = p === "/" ? "/" : path.basename(p);
      it(`should ignore the dirname and use only the basename: ${basename}`, async () => {
        const render = await fixture("custom-permalink", { env: "prod" });
        expect(await render(p)).toMatchSnapshot();
      });
    });
  });
});

["/", "/index.html", "index.html"].forEach((path) => {
  describe(`given the path "${path}"`, () => {
    it(`should only match against the "/" policy path`, async () => {
      const render = await fixture("slash-root", { env: "prod" });
      expect(await render(path)).toMatchSnapshot();
    });
  });
});

/*
WARN: snapshots are prettified by jest-serializer-html
don't rely on them to reflect how the document is truly rendered.
*/
describe("when inline tag sources are enabled", () => {
  ["/", "markdown-1", "markdown-2"].forEach((path) => {
    describe(`path: "${path}"`, () => {
      it(`should contain a hash+base64 source for each script/style, that merges with existing policies`, async () => {
        const render = await fixture("inline-tags", { env: "prod" });
        expect(await render(path)).toMatchSnapshot();
      });
    });
  });
});
