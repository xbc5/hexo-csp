"use strict";
const Config = require("../../lib/config");

describe("for Config.isProd", () => {
  it("should return true if not dev env", async () => {
    const conf = new Config({ csp: { env: "prod" } });
    expect(conf.isProd).toBe(true);
  });

  it("should return true by default if no dev env set", async () => {
    const conf = new Config({ csp: {} });
    expect(conf.isProd).toBe(true);
  });

  it("should return true by default if no config set", async () => {
    const conf = new Config();
    expect(conf.isProd).toBe(true);
  });

  it("should return false if dev env set", async () => {
    const conf = new Config({ csp: { env: "dev" } });
    expect(conf.isProd).toBe(false);
  });

  it("should always be !isDev", async () => {
    const conf1 = new Config({ csp: { env: "dev" } });
    expect(conf1.isProd).toBe(false);
    expect(conf1.isDev).toBe(true);

    const conf2 = new Config({ csp: { env: "prod" } });
    expect(conf2.isProd).toBe(true);
    expect(conf2.isDev).toBe(false);
  });
});
