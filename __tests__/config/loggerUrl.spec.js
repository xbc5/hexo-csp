"use strict";
const Config = require("../../lib/config");

function fixture() {
  return new Config({
    logger: {
      prod: { host: "https://prod-logger.com", path: "/custom-prod-logger" },
      dev: {
        host: "https://dev-logger.com",
        path: "/custom-dev-logger",
        port: 4000,
      },
    },
  });
}

["prod", "dev"].forEach((env) => {
  describe(`when given "${env}" as an arg`, () => {
    it(`should return "${env}" logger path`, async () => {
      const conf = fixture();
      expect(conf.loggerUrl(env)).toMatchSnapshot();
    });

    it(`should throw if value is undefined`, async () => {
      const conf = new Config();
      expect(() => conf.loggerUrl(env)).toThrow();
    });
  });
});
