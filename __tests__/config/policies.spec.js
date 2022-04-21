"use strict";
const Config = require("../../lib/config");

const DEFAULT = {};

describe("for Config.policies in a production environment", () => {
  describe("when only prod policies are specified", () => {
    it("should return the provided value", async () => {
      const policies = {
        default: {
          directives: {
            "default-src": ["'self'"],
            "img-src": ["https://bar.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "default-src": ["'self'", "https://baz.com"],
            "img-src": ["https://foo.com"],
          },
        },
      };

      const expected = {
        default: {
          directives: {
            "default-src": ["'self'"],
            "img-src": ["https://bar.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "default-src": ["'self'", "https://baz.com"],
            "img-src": ["https://foo.com"],
          },
        },
      };
      const config = new Config({ csp: { prod: { policies } } });
      expect(config.policies).toMatchObject(expected);
    });

    it("should return an empty object if no policies", async () => {
      const config = new Config({ csp: { prod: {} } });
      expect(config.policies).toMatchObject(DEFAULT);
    });

    it("should return an empty object if no prod object", async () => {
      const config = new Config({ csp: {} });
      expect(config.policies).toMatchObject(DEFAULT);
    });
  });

  describe("when both prod and dev policies are specified", () => {
    it("should return only the prod policies", async () => {
      const prod = {
        default: {
          directives: {
            "default-src": ["https://prod-default.com"],
            "img-src": ["https://prod-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "img-src": ["https://prod-foo.com"],
          },
        },
      };
      const dev = {
        default: {
          directives: {
            "img-src": ["https://dev-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "default-src": ["https://dev-foo.com"],
          },
        },
      };

      const expected = {
        default: {
          directives: {
            "default-src": ["https://prod-default.com"],
            "img-src": ["https://prod-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "img-src": ["https://prod-foo.com"],
          },
        },
      };
      const config = new Config({
        csp: { prod: { policies: prod }, dev: { policies: dev } },
      });
      expect(config.policies).toMatchObject(expected);
    });
  });
});

describe("for Config.policies in a dev environment", () => {
  describe("when only prod policies are specified", () => {
    it("should return the prod policies", async () => {
      const prod = {
        default: {
          directives: {
            "default-src": ["https://prod-default.com"],
            "img-src": ["https://prod-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "img-src": ["https://prod-foo.com"],
          },
        },
      };

      const expected = {
        default: {
          directives: {
            "default-src": ["https://prod-default.com"],
            "img-src": ["https://prod-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "img-src": ["https://prod-foo.com"],
          },
        },
      };
      const config = new Config({
        csp: { env: "dev", prod: { policies: prod } },
      });
      expect(config.policies).toMatchObject(expected);
    });
  });

  describe("when mode: merge", () => {
    it("should merge PATHS with production policies", async () => {
      const prod = {
        default: {
          directives: {
            "default-src": ["https://prod-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "img-src": ["https://prod-foo.com"],
          },
        },
      };
      const dev = {
        default: {
          directives: {
            "img-src": ["https://dev-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "default-src": ["https://dev-foo.com"],
          },
        },
      };

      const expected = {
        default: {
          directives: {
            "default-src": ["https://prod-default.com"],
            "img-src": ["https://dev-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "img-src": ["https://prod-foo.com"],
            "default-src": ["https://dev-foo.com"],
          },
        },
      };
      const config = new Config({
        csp: { env: "dev", prod: { policies: prod }, dev: { policies: dev } },
      });
      expect(config.policies).toMatchObject(expected);
    });

    it("should merge SOURCES with production", async () => {
      const prod = {
        default: {
          directives: {
            "default-src": ["https://prod-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "img-src": ["https://prod-foo.com"],
          },
        },
      };
      const dev = {
        default: {
          directives: {
            "default-src": ["https://dev-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "img-src": ["https://dev-foo.com"],
          },
        },
      };

      const expected = {
        default: {
          directives: {
            "default-src": [
              "https://prod-default.com",
              "https://dev-default.com",
            ],
          },
        },
        "foo/index.html": {
          directives: {
            "img-src": ["https://prod-foo.com", "https://dev-foo.com"],
          },
        },
      };
      const config = new Config({
        csp: { env: "dev", prod: { policies: prod }, dev: { policies: dev } },
      });
      expect(config.policies).toMatchObject(expected);
    });

    it("should merge PATHS and SOURCES with production", async () => {
      const prod = {
        default: {
          directives: {
            "default-src": ["https://prod-default.com"],
            "img-src": ["https://prod-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "img-src": ["https://prod-foo.com"],
          },
        },
      };
      const dev = {
        default: {
          directives: {
            "default-src": ["https://dev-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "default-src": ["https://dev-foo.com"],
            "img-src": ["https://dev-foo.com"],
          },
        },
      };

      const expected = {
        default: {
          directives: {
            "default-src": [
              "https://prod-default.com",
              "https://dev-default.com",
            ],
            "img-src": ["https://prod-default.com"],
          },
        },
        "foo/index.html": {
          directives: {
            "default-src": ["https://dev-foo.com"],
            "img-src": ["https://prod-foo.com", "https://dev-foo.com"],
          },
        },
      };
      const config = new Config({
        csp: { env: "dev", prod: { policies: prod }, dev: { policies: dev } },
      });
      expect(config.policies).toMatchObject(expected);
    });
  });
});
