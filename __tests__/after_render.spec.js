"use strict";
const { fixture } = require("./helpers/mock");
const path = require("path");

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

// TODO: test prod replace mode
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

describe("given the custom permalink", () => {
  ["2001/01/01/markdown-1", "/", "page-1/"].forEach((p) => {
    describe(p, () => {
      const basename = p === "/" ? "/" : path.basename(p);
      it(`should ignore the dirname and use only the basename: ${basename}`, async () => {
        const render = await fixture("custom-permalink");
        expect(await render(p)).toMatchSnapshot();
      });
    });
  });
});

["/", "/index.html", "index.html"].forEach((path) => {
  describe(`given the path "${path}"`, () => {
    it(`should only match against the "/" policy path`, async () => {
      const render = await fixture("slash-root");
      expect(await render(path)).toMatchSnapshot();
    });
  });
});

/*
WARN: snapshots are prettified with jest-serializer-html
don't rely on them to reflect how the document is truly rendered.

NOTE: pug renders the fixture with newlines and spaces. Use the `hash` NPM script
it recognises control chars.

sha512+base64
  const a = 1;
    ZGUzZTljYzc4M2M1NjU5MjEwNTJlYTUyZWUzYzAyMzc4NDFhODIxYTU1NmZkZTUwZjI2MTJjNmEx
    ZGZjMWQzMWQzZDAxOTQyMmU3ZjY5YmJjMDQzYWNjYTc0YzEzZDY0ODI5NWI2MTQ0ZTA3ZDljMjE3
    NTg0ZmRkNjljNGM3ZDE=
  const b =1;\nconst c = 1;
    MzI4ZDg4OGFkYjY5MGIyY2MzZmIzZWVlMGJjN2YxMDNmMDJhNjI0NzFhNGFmMDJlYWFkZDMyZGIw
    ZDI3MjMyNWIzZmI1OTQ0NDM5YjBhMTA0YTIwNjNhYmVkYzU4ZjliYmFmNWZlNWNmYWRhOTRiYmFi
    MjFkMGRlM2VmYmU4OTA=
  div { color: red; }
    YzU1ZGUzNWU5Nzc2NDBkMTI3ZmY5MDIwOTEwMmE1OGFkZjQ2M2UzY2RmMzc2YjM5N2M1MjI2MDQ1
    Mjk0N2JjZGYyZTdmZDhhYjVhMmYxMTZmMWMxODJmMDQ0YjllMGY2MGQ0OWVmYzJmZDZjMDk2YTFm
    YjIxYmQ3MjUwMThiOTk=
  div {\n  color: blue;\n}
    NzFiYTMzMmIxZjQ5MTRmOTMwODM4MDJhNzVlMzM3MjhlZDFmZTY5MDNiODIzMjhhMWE3Nzg2MjNk
    NGM1MTRlNWIxY2NmYzdlYWVjM2RkY2UyODYwYTgyNzc5NTE5MTQyZGE0OWUxN2UyYWJmYzc2Nzgz
    ZTYwOGI5ODZkOTMxOTc=
*/
describe("when inline tag sources are enabled", () => {
  ["/", "markdown-1", "markdown-2"].forEach((path) => {
    describe(`path: "${path}"`, () => {
      it(`should contain a hash+base64 source for each script/style, that merges with existing policies`, async () => {
        const render = await fixture("inline-tags");
        expect(await render(path)).toMatchSnapshot();
      });
    });
  });
});
