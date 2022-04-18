const Config = require("../lib/config");

describe("for Config.enabled", () => {
  it("should be enabled if enabled:true provided", async () => {
    const config = new Config({ csp: { enabled: true } });
    expect(config.enabled).toBe(true);
  });

  it("should be disabled if no config provided", async () => {
    const config = new Config();
    expect(config.enabled).toBe(false);
  });

  it("should be disabled if no csp config provided", async () => {
    const config = new Config({});
    expect(config.enabled).toBe(false);
  });

  it("should be disabled if no enabled:boolean provided", async () => {
    const config = new Config({ csp: {} });
    expect(config.enabled).toBe(false);
  });

  it("should be disabled if no enabled:false provided", async () => {
    const config = new Config({ csp: {} });
    expect(config.enabled).toBe(false);
  });
});
