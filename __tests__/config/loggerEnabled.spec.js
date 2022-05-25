"use strict";
const Config = require("../../lib/config");

function fixture() {
  const orig = {
    logger: {
      prod: { enabled: true },
      dev: { enabled: false },
    },
  };
  const conf = new Config(orig);
  return { orig, conf };
}

["prod", "dev"].forEach((env) => {
  describe(`when given "${env}" as an arg`, () => {
    const { conf, orig } = fixture();
    const expected = orig.logger[env].enabled;
    it(`should return ${expected} (as per fixture)`, async () => {
      expect(conf.loggerEnabled(env)).toBe(expected);
    });

    it(`should throw if value is undefined`, async () => {
      const conf = new Config();
      expect(() => conf.loggerUrl(env)).toThrow();
    });
  });
});
