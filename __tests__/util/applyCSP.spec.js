"use strict";

const Config = require("../../lib/config");
const { applyCSP } = require("../../lib/util");
const template = require("../helpers/template");

// TODO:
// - test dev env;
//
describe("given valid args", () => {
  it("should return the markup with CSP applied", async () => {
    const c = {
      csp: {
        prod: {
          policies: {
            ["foo/index.html"]: {
              directives: {
                "default-src": ["'self'", "https://foo.com"],
                "img-src": ["https://bar.com"],
              },
            },
          },
        },
      },
    };
    const data = { path: "foo/index.html" };

    const config = new Config(c);
    const markup = applyCSP(config, data, template.noMeta);

    expect(markup).toMatchSnapshot();
  });
});

describe("given frontmatter", () => {
  it("should return the markup with CSP applied", async () => {
    const c = {
      csp: {
        prod: {
          policies: {
            ["foo/index.html"]: {
              directives: {
                "default-src": ["'self'", "https://foo-config.com"],
                "img-src": ["https://bar-config.com"],
              },
            },
          },
        },
      },
    };
    const data = {
      path: "foo/index.html",
      csp: {
        directives: {
          "default-src": ["https://foo-frontmatter.com"],
          "img-src": ["https://bar-frontmatter.com"],
        },
      },
    };

    const config = new Config(c);
    const markup = applyCSP(config, data, template.noMeta);

    expect(markup).toMatchSnapshot();
  });
});

describe("given no directives to apply", () => {
  [
    undefined,
    {},
    { csp: {} },
    { csp: { prod: {} } },
    { csp: { prod: { policies: {} } } },
  ].forEach((c) => {
    const param = c === undefined ? undefined : JSON.stringify(c);
    describe(`i.e. the config object is ${param}`, () => {
      it("it should return the original markup", async () => {
        const data = { path: "foo/index.html" };
        const config = new Config(c);
        const markup = applyCSP(config, data, template.noMeta);

        expect(markup).toBe(template.noMeta);
      });
    });
  });
});
