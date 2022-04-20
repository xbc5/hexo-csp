const Config = require("../../lib/config");

const DEFAULT = 999;

describe("for Config.priority", () => {
  it("should return the provided value", async () => {
    const config = new Config({ csp: { priority: 20 } });
    expect(config.priority).toBe(20);
  });

  it("should return a default value", async () => {
    const config = new Config({ csp: {} });
    expect(config.priority).toBe(DEFAULT);
  });

  it("should return a default value when no config object provided", async () => {
    const config = new Config();
    expect(config.priority).toBe(DEFAULT);
  });

  it("should return a default value when no csp key provided", async () => {
    const config = new Config({});
    expect(config.priority).toBe(DEFAULT);
  });
});
