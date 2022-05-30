"use strict";

const Config = require("../../lib/config");

describe("when env=dev", () => {
  it("should return true", async () => {
    expect(new Config(undefined, "dev").isDev).toBe(true);
  });

  it("should cause Config.isProd to return false", async () => {
    expect(new Config(undefined, "dev").isProd).toBe(false);
  });
});
