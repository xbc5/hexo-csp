"use strict";

const Config = require("../../lib/config");

describe("for Config.inline", () => {
  it("should reflect the specified value", async () => {
    const config = new Config({ csp: { inline: { enabled: true } } });
    expect(config.inline).toBe(true);
  });

  [undefined, {}, { csp: {} }, { csp: { inline: {} } }].forEach((a) => {
    const arg = a === undefined ? "undefined" : JSON.stringify(a);
    it(`should be 'false' by default (given: ${arg})`, async () => {
      const config = new Config(a);
      expect(config.inline).toBe(false);
    });
  });
});
