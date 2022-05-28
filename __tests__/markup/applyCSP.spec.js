"use strict";

const Config = require("../../lib/config");
const Policies = require("../../lib/Policies");
const { applyCSP } = require("../../lib/markup");
const template = require("../helpers/template");

function fixture(conf, data, str, path, err) {
  const c = new Config(conf);
  const policies = new Policies();
  // policies are combined when the app is initialised, so combine them
  // with savePolicy to emulate this.
  conf?.policies?.forEach((p) => policies.savePolicy(p));
  return applyCSP(c, policies, data, str, path, err);
}

// TODO:
// - test dev env;
//
describe("given valid args", () => {
  it("should return the markup with CSP applied", async () => {
    const c = {
      policies: [
        {
          prod: {
            pattern: "foo",
            directives: {
              "default-src": ["'self'", "https://foo.com"],
              "img-src": ["https://bar.com"],
            },
          },
        },
      ],
    };
    const data = { path: "foo/index.html" };

    const markup = fixture(c, data, template.noMeta, data.path);

    expect(markup).toMatchSnapshot();
  });

  it("should apply only the corresponding polices for that path (foo/index.html", async () => {
    const c = {
      policies: [
        {
          pattern: "^bar$",
          prod: {
            directives: {
              "default-src": ["https://config-default-default.com"],
            },
          },
        },
        {
          pattern: "^foo",
          prod: {
            directives: {
              "default-src": ["https://config-foo-default.com"],
            },
          },
        },
      ],
    };
    const data = {
      path: "foo/index.html",
      page: {
        csp: {
          prod: {
            mode: "merge",
            directives: {
              "default-src": ["https://frontmatter-foo-default.com"],
            },
          },
        },
      },
    };

    const markup = fixture(c, data, template.noMeta, data.path);

    expect(markup).toMatchSnapshot();
  });
});

describe("given frontmatter", () => {
  describe("mode=[default] (merge)", () => {
    it("should merge the frontmatter and return the markup", async () => {
      const c = {
        policies: [
          {
            pattern: "foo",
            prod: {
              directives: {
                "default-src": ["https://config-foo-default.com"],
                "img-src": ["https://config-foo-img.com"],
              },
            },
          },
        ],
      };
      const data = {
        path: "foo/index.html",
        page: {
          csp: {
            prod: {
              // FIXME: pattern?
              directives: {
                "default-src": ["https://frontmatter-foo-default.com"],
                "img-src": ["https://frontmatter-foo-img.com"],
              },
            },
          },
        },
      };

      const markup = fixture(c, data, template.noMeta, data.path);

      expect(markup).toMatchSnapshot();
    });
  });

  describe("mode=merge", () => {
    it("should merge the frontmatter and return the markup", async () => {
      const c = {
        policies: [
          {
            pattern: "foo",
            prod: {
              directives: {
                "default-src": ["https://config-foo-default.com"],
                "img-src": ["https://config-foo-img.com"],
              },
            },
          },
        ],
      };
      const data = {
        path: "foo/index.html",
        page: {
          csp: {
            // FIXME: pattern?
            prod: {
              mode: "merge",
              directives: {
                "default-src": ["https://frontmatter-foo-default.com"],
                "img-src": ["https://frontmatter-foo-img.com"],
              },
            },
          },
        },
      };

      const markup = fixture(c, data, template.noMeta, data.path);

      expect(markup).toMatchSnapshot();
    });
  });

  describe("mode=replace", () => {
    it("should replace the config with the frontmatter and return the markup", async () => {
      const c = {
        policies: [
          {
            // applyCSP encloses the path (minus index) with ^$:
            // foo/index.html => ^foo$, and uses that value to do a literal
            // comparison. If that comparison doesn't match, then no policies
            // will get replaced. So use ^foo$ so that the patterns are identical.
            pattern: "^foo$",
            prod: {
              directives: {
                "default-src": ["https://config-foo-default.com"],
                "img-src": ["https://config-foo-img.com"],
              },
            },
          },
        ],
      };
      const data = {
        path: "foo/index.html",
        page: {
          csp: {
            prod: {
              mode: "replace",
              directives: {
                "default-src": ["https://frontmatter-foo-default.com"],
                "img-src": ["https://frontmatter-foo-img.com"],
              },
            },
          },
        },
      };

      const markup = fixture(c, data, template.noMeta, data.path);

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
    { page: { policies: [] } },
    { page: { policies: [{ prod: {} }] } },
    { page: { policies: [{ prod: { directves: {} } }] } },
  ].forEach((c) => {
    const param = c === undefined ? undefined : JSON.stringify(c);
    describe(`i.e. the config object is ${param}`, () => {
      it("it should return the original markup", async () => {
        const data = { path: "foo/index.html" };
        const markup = fixture(c, data, template.noMeta, data.path);
        expect(markup).toBe(template.noMeta);
      });
    });
  });
});

describe("for inline tags", () => {
  describe("given inline scripts, styles and additional policies", () => {
    it("should merge content hashes, and apply policies", async () => {
      const c = {
        inline: {
          enabled: true,
          algo: "sha256",
        },
        policies: [
          {
            pattern: "foo",
            prod: {
              directives: {
                "style-src": ["https://policy-foo-style.com"],
                "script-src": ["https://policy-foo-script.com"],
                "default-src": ["https://policy-foo-default.com"],
              },
            },
          },
        ],
      };
      const data = { path: "foo/index.html" };

      const markup = fixture(
        c,
        data,
        template.mixedStyleScriptsForHashing,
        data.path
      );

      expect(markup).toMatchSnapshot();
    });
  });

  ["sha256", "sha384", "sha512"].forEach((algo) => {
    describe(`and given ${algo}`, () => {
      it(`it should inject a ${algo}+base64 source for each`, async () => {
        const c = {
          inline: {
            enabled: true,
            algo,
          },
        };
        const data = { path: "foo/index.html" };

        const markup = fixture(
          c,
          data,
          template.mixedStyleScriptsForHashing,
          data.path
        );

        expect(markup).toMatchSnapshot();
      });
    });
  });

  describe("when disabled", () => {
    it("should not generate hashes (but still apply other policies)", async () => {
      const c = {
        inline: {
          enabled: false,
          algo: "sha256",
        },
        policies: [
          {
            pattern: "foo",
            prod: {
              directives: {
                "style-src": ["https://policy-foo-style.com"],
                "script-src": ["https://policy-foo-script.com"],
                "default-src": ["https://policy-foo-default.com"],
              },
            },
          },
        ],
      };
      const data = { path: "foo/index.html" };

      const markup = fixture(
        c,
        data,
        template.mixedStyleScriptsForHashing,
        data.path
      );

      expect(markup).toMatchSnapshot();
    });
  });
});
