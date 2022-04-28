"use strict";

const { applyCSP } = require("./lib/markup");
const Config = require("./lib/config-factory");
const { registerCli } = require("./lib/cli");
const util = require("util");

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

function handleRender(hexo) {
  // TODO: only inject config.csp
  const config = Config(hexo.config);

  if (config.enabled) {
    if (error(config.validate(), hexo)) return;

    hexo.extend.filter.register(
      "after_render:html",
      function run(str, data) {
        // TODO: you need to handle default path
        return applyCSP(config, data, str, (e) => error(e, hexo, data.path));
      },
      config.priority
    );
  }
}

handleRender(hexo);
