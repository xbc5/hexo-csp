const logger = require("../../../lib/logger");
const Policies = require("../../../lib/Policies");
const Config = require("../../../lib/config");

it("should should be defined", async () => {
  expect(logger.addPolicies).toBeDefined();
});

function fixture({ env }) {
  const loggerConf = {
    prod: {
      host: "https://production.com",
      path: "/csp-logger",
    },
    dev: {
      host: "localhost",
      port: "4000",
      path: "/csp-logger",
    },
  };
  const config = new Config({ env, logger: loggerConf });
  const policies = new Policies({ env });
  const add = (p = policies, c = config) => {
    return logger.addPolicies(p, c);
  };
  return { config, policies, addPolicies: add };
}
["prod", "dev"].forEach((env) => {
  describe(`for the ${env} environment`, () => {
    it(`should add the ${env} policy`, async () => {
      const { policies, addPolicies } = fixture({ env });
      addPolicies();
      expect(policies.policies).toMatchSnapshot();
    });
  });
});
