"use strict";
const Config = require("../../lib/config");
const fc = require("fast-check");
const { assert } = require("../helpers/properties");

["prod", "production"].forEach((env) => {
  describe("for production environments", () => {
    it(`should return 'prod' when env is "${env}"`, async () => {
      const conf = new Config(undefined, env);
      expect(conf.env).toBe("prod");
    });
  });
});

["dev", "development", "trace", "debug", "test", "testing"].forEach((env) => {
  describe("for development environments", () => {
    it(`should return 'dev' when env is "${env}"`, async () => {
      const conf = new Config(undefined, env);
      expect(conf.env).toBe("dev");
    });
  });
});

describe("for invalid environments", () => {
  const validEnvs = [
    "prod",
    "dev",
    "production",
    "developent",
    "trace",
    "debug",
    "test",
    "testing",
  ];

  it(`should return 'prod' by default`, async () => {
    assert(fc.string(), (env) => {
      fc.pre(!validEnvs.includes(env));
      const conf = new Config(undefined, env);
      expect(conf.env).toBe("prod");
    });
  });

  it("should call the logger", async () => {
    assert(fc.string(), (env) => {
      fc.pre(!validEnvs.includes(env));
      const warn = jest.fn();
      const conf = new Config(undefined, env, { warn });
      expect(warn).toHaveBeenCalledTimes(1);
    });
  });

  it("should call the logger with an argument", async () => {
    assert(fc.string(), (env) => {
      fc.pre(!validEnvs.includes(env));
      const warn = jest.fn();
      new Config(undefined, env, { warn });
      expect(warn.mock.calls[0][0]).toBeTruthy();
    });
  });
});

it("should return 'prod' by default", async () => {
  const conf = new Config();
  expect(conf.env).toBe("prod");
});
