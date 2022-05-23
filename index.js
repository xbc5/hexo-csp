"use strict";

const { applyCSP } = require("./lib/markup");
const Config = require("./lib/config-factory");
const { registerCli } = require("./lib/cli");
const util = require("util");
const Policies = require("./lib/Policies");
const Middleware = require("./lib/Middleware");
const { config: schema } = require("./lib/validation");
const clone = require("lodash.clonedeep");

registerCli(hexo);

function error(error, hexo, path) {
  if (error !== undefined) {
    const log = hexo.log || console;
    const debug = hexo?.env?.debug === true;

    const suffix = debug
      ? ":\n" + util.inspect(error, false, null, true)
      : "! Use --debug for details.";

    log.error(
      `CSP ${path ? "frontmatter" : "config"} validation error` + suffix
    );
    log.warn(`A CSP will not be applied${path ? " to " + path : ""}.`);
  }
  return error !== undefined;
}

const validated = schema.validate(clone(hexo.config.csp));

if (!error(validated.error, hexo)) {
  const config = Config(validated.value);

  if (config.loggerEnabled("dev")) {
    // The Hexo server IS a development server. No need to check env. Env is
    // for determining what to build, not what to run.
    new Middleware(hexo, config).acceptJSON().logCSP();
  }

  function handleRender(hexo) {
    if (config.enabled) {
      const policies = new Policies({ env: config.env });
      if (config.policies)
        config.policies.forEach((p) => policies.savePolicy(p));

      hexo.extend.filter.register(
        "after_render:html",
        function run(str, data) {
          return applyCSP(config, policies, data, str, (e) => {
            return error(e, hexo, data.path);
          });
        },
        config.priority
      );
    }
  }

  handleRender(hexo);
}
