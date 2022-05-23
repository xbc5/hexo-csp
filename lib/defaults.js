const clone = require("lodash.clonedeep");

const DEFAULTS = {
  logger: {
    prod: {
      // if prod isn't specified, it isn't enabled. If it is,
      // then validation should require a URI.
      enabled: false,
    },
    dev: {
      enabled: true,
      uri: "/csp-logger",
    },
  },
};

module.exports = clone(DEFAULTS);
