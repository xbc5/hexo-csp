"use strict";
const Config = require("../../lib/config");

it("should return 'prod' when env is prod", async () => {
  const conf = new Config({ env: "prod" });
  expect(conf.env).toBe("prod");
});

it("should return 'prod' by default", async () => {
  const conf = new Config();
  expect(conf.env).toBe("prod");
});

it("should return 'dev' when env is dev", async () => {
  const conf = new Config({ env: "dev" });
  expect(conf.env).toBe("dev");
});
