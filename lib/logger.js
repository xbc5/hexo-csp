const util = require("util");

function format(obj) {
  // this is more for testing. It makes it easier to match
  // the message, since there is some fancy styling applied.
  // It makes it consistent.
  return util.inspect(obj, false, null, true);
}

function middleware(log = console.error) {
  return (req, res) => {
    log(format(req.body));
    res.end();
  };
}

function addPolicies(policies, config) {
  let p = {
    pattern: ".+", // everything
    prod: { directives: {} },
    dev: { directives: {} },
  };

  // we don't want to log to two locations, so makes these mutually exclusive.
  // Remember, this affects the build output, so the environment matters.
  if (config.isProd) {
    p.prod = {
      mode: "merge",
      directives: {
        "report-uri": [config.loggerUrl("prod")],
      },
    };
  } else {
    p.dev = {
      mode: "merge",
      directives: {
        "report-uri": [config.loggerUrl("dev")],
      },
    };
  }

  policies.savePolicy(p);
}

module.exports = { middleware, format, addPolicies };
