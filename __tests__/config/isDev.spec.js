"use strict";

const Config = require("../../lib/config");

const DEFAULT = {};

describe("for Config.isDev", () => {
  describe("when env=dev", () => {
    it("should return true", async () => {
      const conf = { csp: { env: "dev" } };
      expect(new Config(conf).isDev).toBe(true);
    });

    it("should cause Config.isProd to return false", async () => {
      const conf = { csp: { env: "dev" } };
      expect(new Config(conf).isProd).toBe(false);
    });
  });
});
