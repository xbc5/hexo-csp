"use strict";

const Config = require("../../lib/config");
const Policies = require("../../lib/Policies");
const { applyCSP } = require("../../lib/markup");
const template = require("../helpers/template");

function run(conf, data, str, err) {
  const c = new Config(conf);
  const policies = new Policies();
  // policies are combined when the app is initialised, so combine them
  // with savePolicy to emulate this.
  conf?.csp?.policies?.forEach((p) => policies.savePolicy(p));
  return applyCSP(c, policies, data, str, err);
}

// TODO:
// - test dev env;
//
describe("given valid args", () => {
  it("should return the markup with CSP applied", async () => {
    const c = {
      csp: {
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
      },
    };
    const data = { path: "foo/index.html" };

    const markup = run(c, data, template.noMeta);

    expect(markup).toMatchSnapshot();
  });

  it("should apply only the corresponding polices for that path (foo/index.html", async () => {
    const c = {
      csp: {
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
      },
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

    const markup = run(c, data, template.noMeta);

    expect(markup).toMatchSnapshot();
  });
});

describe("given frontmatter", () => {
  describe("mode=[default] (merge)", () => {
    it("should merge the frontmatter and return the markup", async () => {
      const c = {
        csp: {
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
        },
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

      const markup = run(c, data, template.noMeta);

      expect(markup).toMatchSnapshot();
    });
  });

  describe("mode=merge", () => {
    it("should merge the frontmatter and return the markup", async () => {
      const c = {
        csp: {
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
        },
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

      const markup = run(c, data, template.noMeta);

      expect(markup).toMatchSnapshot();
    });
  });

  describe("mode=replace", () => {
    it("should replace the config with the frontmatter and return the markup", async () => {
      const c = {
        csp: {
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
        },
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

      const markup = run(c, data, template.noMeta);

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
    { page: { csp: { policies: [] } } },
    { page: { csp: { policies: [{ prod: {} }] } } },
    { page: { csp: { policies: [{ prod: { directves: {} } }] } } },
  ].forEach((c) => {
    const param = c === undefined ? undefined : JSON.stringify(c);
    describe(`i.e. the config object is ${param}`, () => {
      it("it should return the original markup", async () => {
        const data = { path: "foo/index.html" };
        const markup = run(c, data, template.noMeta);
        expect(markup).toBe(template.noMeta);
      });
    });
  });
});

describe("for inline tags", () => {
  describe("given inline scripts, styles and additional policies", () => {
    it("should merge content hashes, and apply policies", async () => {
      const c = {
        csp: {
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
        },
      };
      const data = { path: "foo/index.html" };

      const markup = run(c, data, template.mixedStyleScripts);

      expect(markup).toMatchSnapshot();
    });
  });

  ["sha256", "sha384", "sha512"].forEach((algo) => {
    /*
    Expected "hashes" (hash=>base64).

    sha-256:
      const a=1;
        YjZlMjI0ZjE0MzBjZTU1MmJhMGU3ZjA5OWY3NzhmNGE4OTY4ZGQ4YjMzM2UyZjg5Nzg5YWRkY2Vi
        M2FjODZjYw==
      const b=1;
        YWE3MTY0NGRjYmE4MDI5ZWE4M2I1NDU5MjcyZTlhMzdmZjY4ZGUyNmE3YjAwMzA5NGIxZDE5MmVh
        NmU0ZmM5Ng==
      css: is-bad
        ODQ0MDEzNWZiYjE0NjY4OTU3ZjQ3NDE4NjkwZmFjNDkxNmU0OWYzNTkxOWQ2ZjMyZWQ5M2RkMTY1
        NmRhNjFkZA==
      css: sucks
        OWNjNzc1MTdmMmNjMmIzNmM0OWJjOTk2NmRjNGNkMGJhMjFmNmFiZDZjYmFkMDBjMjQ5ZDZlYWEx
        YmM5ZmRjZg==

    sha-384:
      const a=1;
        Yjk5NGZlNWVkMWJiNDZlMjZkN2E5ODY5M2FkYmJhYWM5MWQ2MzI4ZTIzOTAzNWVhMTdiY2U5MmE1
        OTQxMDY3MDQyNTAzMTg0MGI1MTAwN2Q0YzVhZjY2MTNiNzFkNzFi
      const b=1;
        YzU1YjgyZjdmNjZjNzQyYTBjOThlOWM1NzBkZTc2ZDM5YTE5MGM4YTkxNmNlNzdiNmRjYThkYmZi
        YzcyMmFjYWZiYmUwODM1ODIxZGNjMDFjZjBjN2ExMjViMjQ2MDQ4
      css: is-bad
        ZDhkYjljMzNiN2Q3MGQ1ZGFjMzZlMTIwOTZiOTQ4YTZmNDk4ZTlhZGNjZGIwMzRlY2VlYzNiNDIz
        ODNiZjg5ZGUxMzc5MmYwZjA5MWI3NDkyMmVjNDkxYzJhNThiZWJl
      css: sucks
        OWNmMzcwOGE3OGYyNmYwOTM0ZmMzY2IwZDY0ZGRiMGRhNmU1ZTFiOTQxOWQwZGJiNmVmZWJiNDUy
        YzkzYWEwNGU1YzdlMTM4MzRhZGNkZGU0NWE2MmUzMzVhNmY0ZjRh

    sha-512:
      const a=1;
        ZmY5ZTdjNzk4MmM3MmE3ZjE4Mjk2OTI3MmU4MTc5NDZmNDMwMTBlNmY0ZTdmYTU0ZTI5MTUyY2Vm
        MzdmZDA1NWI5YmNmNGE1MWQ4MjBiNTIyYjMxNzY2ZmMyZTUyYjM1YzkwYzAzZjM0MGNjNjk4MDEy
        NDYxODRhZWM5N2MwYWY=
      const b=1;
        ZDgzMjA1MTFlYTYxNDhhYzMxYWM4MzcwN2FjZmM3ZjVhMmRhN2Q2YWI5MTlmMzk5YjQ0NjU0NTRm
        ZjYwMjQzZTZhNDhiODlhY2YyOTAyYWE5NWVlZDFjMjE3Zjk5ODY4OTQxZTcxMDFmNGY4YzI3N2Mw
        ODYyNTZjMDZlY2JlMmU=
      css: is-bad
        NTNiNDg0YjhhYWFkMzFkODAxMjg2OGVjMGFlZWQyODRjNGU2Mzg4M2YyOTM4MDQ3ZjRiZmNiZGQ2
        MWQyOTQyOTg5YzFjYTUzMDc2MDcxMmNkZTRlZWY2YjZjODJkMWVlYmU2YTIwOTVmZjMyNDhkOThk
        YjlhMWJiODlhYmQ4ODg=
      css: sucks
        OTY2MDg1NzE5Yzc5ODI0NDY0NTAxZDdjOGEwNmMyOGExNTg4ZmYzOTRhNDJjZDI5NmU3ZTgxMTI2
        YjU2NDMzZDM1YTQyNjAwZmRhOWVlYmQ0YWNmNDliMzE3ODkwYjZhMDRiOTIwZWZmNzJlYjBhOWNi
        ZjU1NTFkMmIwMjcyODc=
     */
    describe(`and given ${algo}`, () => {
      it(`it should inject a ${algo}+base64 source for each`, async () => {
        const c = {
          csp: {
            inline: {
              enabled: true,
              algo,
            },
          },
        };
        const data = { path: "foo/index.html" };

        const markup = run(c, data, template.mixedStyleScriptsForHashing);

        expect(markup).toMatchSnapshot();
      });
    });
  });

  describe("when disabled", () => {
    it("should not generate hashes (but still apply other policies)", async () => {
      const c = {
        csp: {
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
        },
      };
      const data = { path: "foo/index.html" };

      const markup = run(c, data, template.mixedStyleScripts);

      expect(markup).toMatchSnapshot();
    });
  });
});
