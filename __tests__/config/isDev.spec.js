"use strict";
const Config = require("../../lib/config");

const DEFAULT = {};

describe("for Config.isDev", () => {
  describe('when NODE_ENV="dev"', () => {
    let prev;

    beforeEach(() => {
      prev = process.env["NODE_ENV"];
      process.env["NODE_ENV"] = "dev";
    });

    afterEach(() => {
      process.env["NODE_ENV"] = prev;
    });

    it("should return true when csp.dev.env = ['dev']", async () => {
      const conf = { csp: { dev: { env: ["dev"] } } };
      expect(new Config(conf).isDev).toBe(true);
    });

    it("should return true when csp.dev.env = ['dev', 'foo']", async () => {
      const conf = { csp: { dev: { env: ["dev"] } } };
      expect(new Config(conf).isDev).toBe(true);
    });

    it("should cause Config.isProd to return false", async () => {
      const conf = { csp: { dev: { env: ["dev"] } } };
      expect(new Config(conf).isProd).toBe(false);
    });
  });

  describe('when NODE_ENV="foo"', () => {
    let prev;

    beforeEach(() => {
      prev = process.env["NODE_ENV"];
      process.env["NODE_ENV"] = "foo";
    });

    afterEach(() => {
      process.env["NODE_ENV"] = prev;
    });

    ["", "foos", ".?foo"].forEach((env) => {
      it(`should return false when csp.dev.env = ['${env}']`, async () => {
        const conf = { csp: { dev: { env: [env] } } };
        expect(new Config(conf).isDev).toBe(false);
      });
    });
  });

  ["dev", "develop", "development", "test", "trace", "debug"].forEach((env) => {
    describe(`when NODE_ENV="${env}" `, () => {
      let prev;

      beforeEach(() => {
        prev = process.env["NODE_ENV"];
        process.env["NODE_ENV"] = env;
      });

      afterEach(() => {
        process.env["NODE_ENV"] = prev;
      });

      it("should return true by default when csp.dev.env is not set", async () => {
        const conf = { csp: { dev: {} } };
        expect(new Config(conf).isDev).toBe(true);
      });

      it("should return true by default when csp.dev is not set", async () => {
        const conf = { csp: {} };
        expect(new Config(conf).isDev).toBe(true);
      });

      it("should return true by default when no config set", async () => {
        expect(new Config().isDev).toBe(true);
      });

      it("should cause Config.isProd to return false", async () => {
        const conf = { csp: { dev: { env: [env] } } };
        expect(new Config(conf).isProd).toBe(false);
      });
    });
  });
});
