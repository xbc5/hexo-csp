const clone = require("lodash.clonedeep");

const DEFAULTS = {
  logger: {
    prod: {
      // if prod isn't specified, it isn't enabled. If it is,
      // then validation should require at least a host + path.
      enabled: false,
    },
    dev: {
      enabled: true,
      host: "http://localhost",
      port: "4000",
      path: "/csp-logger",
    },
  },
};

module.exports = clone(DEFAULTS);
