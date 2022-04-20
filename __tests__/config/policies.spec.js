"use strict";
const Config = require("../../lib/config");

const DEFAULT = {};

describe("for Config.policies in a production environment", () => {
  let prev;

  beforeAll(() => {
    prev = process.env["NODE_ENV"];
    process.env["NODE_ENV"] = "prod";
  });

  afterAll(() => {
    process.env["NODE_ENV"] = prev;
  });

  describe("when only prod policies are specified", () => {
    it("should return the provided value", async () => {
      const policies = {
        default: {
          "default-src": ["'self'"],
          "img-src": ["https://bar.com"],
        },
        "foo/index.html": {
          "default-src": ["'self'", "https://baz.com"],
          "img-src": ["https://foo.com"],
        },
      };

      const expected = {
        default: {
          path: "default",
          directives: {
            "default-src": ["'self'"],
            "img-src": ["https://bar.com"],
          },
        },
        "foo/index.html": {
          path: "foo/index.html",
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
          "default-src": ["https://prod-default.com"],
          "img-src": ["https://prod-default.com"],
        },
        "foo/index.html": {
          "img-src": ["https://prod-foo.com"],
        },
      };
      const dev = {
        default: {
          "img-src": ["https://dev-default.com"],
        },
        "foo/index.html": {
          "default-src": ["https://dev-foo.com"],
        },
      };

      const expected = {
        default: {
          path: "default",
          directives: {
            "default-src": ["https://prod-default.com"],
            "img-src": ["https://prod-default.com"],
          },
        },
        "foo/index.html": {
          path: "foo/index.html",
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
  let prev;

  beforeAll(() => {
    prev = process.env["NODE_ENV"];
    // WARN: this depends on one of the default dev envs, if that changes, then so should this.
    process.env["NODE_ENV"] = "dev";
  });

  afterAll(() => {
    process.env["NODE_ENV"] = prev;
  });

  describe("when only prod policies are specified", () => {
    it("should return the prod policies", async () => {
      const prod = {
        default: {
          "default-src": ["https://prod-default.com"],
          "img-src": ["https://prod-default.com"],
        },
        "foo/index.html": {
          "img-src": ["https://prod-foo.com"],
        },
      };

      const expected = {
        default: {
          path: "default",
          directives: {
            "default-src": ["https://prod-default.com"],
            "img-src": ["https://prod-default.com"],
          },
        },
        "foo/index.html": {
          path: "foo/index.html",
          directives: {
            "img-src": ["https://prod-foo.com"],
          },
        },
      };
      const config = new Config({
        csp: { prod: { policies: prod } },
      });
      expect(config.policies).toMatchObject(expected);
    });
  });

  describe("when mode: merge", () => {
    it("should merge PATHS with production", async () => {
      const prod = {
        default: {
          "default-src": ["https://prod-default.com"],
        },
        "foo/index.html": {
          "img-src": ["https://prod-foo.com"],
        },
      };
      const dev = {
        default: {
          "img-src": ["https://dev-default.com"],
        },
        "foo/index.html": {
          "default-src": ["https://dev-foo.com"],
        },
      };

      const expected = {
        default: {
          path: "default",
          directives: {
            "default-src": ["https://prod-default.com"],
            "img-src": ["https://dev-default.com"],
          },
        },
        "foo/index.html": {
          path: "foo/index.html",
          directives: {
            "img-src": ["https://prod-foo.com"],
            "default-src": ["https://dev-foo.com"],
          },
        },
      };
      const config = new Config({
        csp: { prod: { policies: prod }, dev: { policies: dev } },
      });
      expect(config.policies).toMatchObject(expected);
    });

    it("should merge SOURCES with production", async () => {
      const prod = {
        default: {
          "default-src": ["https://prod-default.com"],
        },
        "foo/index.html": {
          "img-src": ["https://prod-foo.com"],
        },
      };
      const dev = {
        default: {
          "default-src": ["https://dev-default.com"],
        },
        "foo/index.html": {
          "img-src": ["https://dev-foo.com"],
        },
      };

      const expected = {
        default: {
          path: "default",
          directives: {
            "default-src": [
              "https://prod-default.com",
              "https://dev-default.com",
            ],
          },
        },
        "foo/index.html": {
          path: "foo/index.html",
          directives: {
            "img-src": ["https://prod-foo.com", "https://dev-foo.com"],
          },
        },
      };
      const config = new Config({
        csp: { prod: { policies: prod }, dev: { policies: dev } },
      });
      expect(config.policies).toMatchObject(expected);
    });

    it("should merge PATHS and SOURCES with production", async () => {
      const prod = {
        default: {
          "default-src": ["https://prod-default.com"],
          "img-src": ["https://prod-default.com"],
        },
        "foo/index.html": {
          "img-src": ["https://prod-foo.com"],
        },
      };
      const dev = {
        default: {
          "default-src": ["https://dev-default.com"],
        },
        "foo/index.html": {
          "default-src": ["https://dev-foo.com"],
          "img-src": ["https://dev-foo.com"],
        },
      };

      const expected = {
        default: {
          path: "default",
          directives: {
            "default-src": [
              "https://prod-default.com",
              "https://dev-default.com",
            ],
            "img-src": ["https://prod-default.com"],
          },
        },
        "foo/index.html": {
          path: "foo/index.html",
          directives: {
            "default-src": ["https://dev-foo.com"],
            "img-src": ["https://prod-foo.com", "https://dev-foo.com"],
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
