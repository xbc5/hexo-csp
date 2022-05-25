"use strict";
const Config = require("../../lib/config");

function fixture() {
  return new Config({
    logger: {
      prod: { path: "/custom-prod-logger" },
      dev: { path: "/custom-dev-logger" },
    },
  });
}

["prod", "dev"].forEach((env) => {
  describe(`when given "${env}" as an arg`, () => {
    it(`should return "${env}" logger path`, async () => {
      const conf = fixture();
      expect(conf.loggerPath(env)).toBe(`/custom-${env}-logger`);
    });

    it(`should throw if value is undefined`, async () => {
      const conf = new Config();
      expect(() => conf.loggerPath(env)).toThrow();
    });
  });
});
