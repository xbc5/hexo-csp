"use strict";

const Config = require("../../lib/config");
const { applyCSP } = require("../../lib/markup");
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

  it("should apply only the corresponding polices for that path (foo/index.html", async () => {
    const c = {
      csp: {
        prod: {
          policies: {
            default: {
              directives: {
                "default-src": ["https://config-default-default.com"],
              },
            },
            ["foo/index.html"]: {
              directives: {
                "default-src": ["https://config-foo-default.com"],
              },
            },
          },
        },
      },
    };
    const data = {
      path: "foo/index.html",
      page: {
        csp: {
          mode: "merge",
          directives: {
            "default-src": ["https://frontmatter-foo-default.com"],
          },
        },
      },
    };

    const config = new Config(c);
    const markup = applyCSP(config, data, template.noMeta);

    expect(markup).toMatchSnapshot();
  });
});

describe("given frontmatter", () => {
  describe("mode=[default] (merge)", () => {
    it("should merge the frontmatter and return the markup", async () => {
      const c = {
        csp: {
          prod: {
            policies: {
              ["foo/index.html"]: {
                directives: {
                  "default-src": ["https://config-foo-default.com"],
                  "img-src": ["https://config-foo-img.com"],
                },
              },
            },
          },
        },
      };
      const data = {
        path: "foo/index.html",
        page: {
          csp: {
            directives: {
              "default-src": ["https://frontmatter-foo-default.com"],
              "img-src": ["https://frontmatter-foo-img.com"],
            },
          },
        },
      };

      const config = new Config(c);
      const markup = applyCSP(config, data, template.noMeta);

      expect(markup).toMatchSnapshot();
    });
  });

  describe("mode=merge", () => {
    it("should merge the frontmatter and return the markup", async () => {
      const c = {
        csp: {
          prod: {
            policies: {
              ["foo/index.html"]: {
                directives: {
                  "default-src": ["https://config-foo-default.com"],
                  "img-src": ["https://config-foo-img.com"],
                },
              },
            },
          },
        },
      };
      const data = {
        path: "foo/index.html",
        page: {
          csp: {
            mode: "merge",
            directives: {
              "default-src": ["https://frontmatter-foo-default.com"],
              "img-src": ["https://frontmatter-foo-img.com"],
            },
          },
        },
      };

      const config = new Config(c);
      const markup = applyCSP(config, data, template.noMeta);

      expect(markup).toMatchSnapshot();
    });
  });

  describe("mode=replace", () => {
    it("should replace the config with the frontmatter and return the markup", async () => {
      const c = {
        csp: {
          prod: {
            policies: {
              ["foo/index.html"]: {
                directives: {
                  "default-src": ["https://config-foo-default.com"],
                  "img-src": ["https://config-foo-img.com"],
                },
              },
            },
          },
        },
      };
      const data = {
        path: "foo/index.html",
        page: {
          csp: {
            mode: "replace",
            directives: {
              "default-src": ["https://frontmatter-foo-default.com"],
              "img-src": ["https://frontmatter-foo-img.com"],
            },
          },
        },
      };

      const config = new Config(c);
      const markup = applyCSP(config, data, template.noMeta);

      expect(markup).toMatchSnapshot();
    });
  });
});

describe("given no directives to apply", () => {
  [
    undefined,
    null,
    {},
    { page: {} },
    { page: { csp: {} } },
    { page: { csp: { prod: {} } } },
    { page: { csp: { prod: { policies: {} } } } },
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
