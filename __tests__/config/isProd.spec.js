"use strict";
const Config = require("../../lib/config");

describe("for Config.isProd", () => {
  let prev;

  beforeEach(() => {
    prev = process.env["NODE_ENV"];
    process.env["NODE_ENV"] = "foo";
  });

  afterEach(() => {
    process.env["NODE_ENV"] = prev;
  });

  it("should return true if not dev env", async () => {
    const conf = new Config({ csp: { dev: { env: ["bar"] } } });
    expect(conf.isDev).toBe(false);
    expect(conf.isProd).toBe(true);
  });

  it("should return true by default if no dev env set", async () => {
    const conf = new Config({ csp: {} });
    expect(conf.isDev).toBe(false);
    expect(conf.isProd).toBe(true);
  });

  it("should return true by default if no config set", async () => {
    const conf = new Config();
    expect(conf.isDev).toBe(false);
    expect(conf.isProd).toBe(true);
  });

  it("should return false if dev env set", async () => {
    const conf = new Config({ csp: { dev: { env: ["foo"] } } });
    expect(conf.isDev).toBe(true);
    expect(conf.isProd).toBe(false);
  });
});
