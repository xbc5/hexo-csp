"use strict";

const Config = require("../../lib/config");

describe("for Config.algo", () => {
  it("should reflect the specified value", async () => {
    const config = new Config({ csp: { inline: { algo: "sha512" } } });
    expect(config.algo).toBe("sha512");
  });

  [undefined, {}, { csp: {} }, { csp: { inline: {} } }].forEach((a) => {
    const arg = a === undefined ? "undefined" : JSON.stringify(a);
    it(`should be 'sha256' by default (given: ${arg})`, async () => {
      const config = new Config(a);
      expect(config.algo).toBe("sha256");
    });
  });
});
