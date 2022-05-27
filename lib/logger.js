const util = require("util");

function format(obj) {
  // this is more for testing. It makes it easier to match
  // the message, since there is some fancy styling applied.
  // It makes it consistent.
  return util.inspect(obj, false, null, true);
}

function middleware(msg, log = console.error) {
  return (req, res) => {
    log(`${msg}\n${format(req.body)}`);
    res.end();
  };
}

function reportUriHeader(reportUrl, directives) {
  return (_, res, next) => {
    // WARN: report-to is experimental, setting it before other directives causes breakage
    res.setHeader(
      "Content-Security-Policy",
      `${directives}; report-uri ${reportUrl}; report-to ${JSON.stringify({
        group: "csp-endpoint",
        max_age: 10886400,
        endpoints: [{ url: reportUrl }],
      })};`
    );
    next();
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

module.exports = { middleware, format, addPolicies, reportUriHeader };
