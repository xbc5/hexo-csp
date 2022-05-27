"use strict";

const { applyCSP } = require("./lib/markup");
const Config = require("./lib/config-factory");
const { registerCli } = require("./lib/cli");
const util = require("util");
const Policies = require("./lib/Policies");
const Middleware = require("./lib/Middleware");
const { config: schema } = require("./lib/validation");
const clone = require("lodash.clonedeep");
const Cache = require("./lib/DirectivesCache-factory");
const { stripIndex } = require("./lib/util");
const Directives = require("./lib/Directives");

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

  // TODO: test me: cache, cmd, middleware applied, CSP logging
  if (config.enabled) {
    const cache = Cache();

    if (hexo.env.cmd === "generate") {
      const policies = new Policies({ env: config.env });
      if (config.policies)
        config.policies.forEach((p) => policies.savePolicy(p));

      hexo.extend.filter.register(
        "after_render:html",
        function (str, data) {
          const path = stripIndex(data.page?.slug || data.path);

          const markup = applyCSP(config, policies, data, str, path, (e) => {
            return error(e, hexo, data.path);
          });

          const toCache = {
            base: data?.page?.base,
            path: data?.path,
            canonical_path: data?.page?.canonical_path,
            slug: data?.page?.slug,
            permalink: data?.page?.permalink,
            full_source: data?.page?.full_source,
            directives: policies.directives(path),
          };
          cache.add(data?.path, toCache);

          return markup;
        },
        config.priority
      );

      // Hexo before_exit is racy, use this instead
      const onExit = () => cache.write();
      process.on("exit", onExit);
      process.on("SIGINT", onExit);
    } else if (hexo.env.cmd === "server") {
      if (config.loggerEnabled("dev")) {
        const cached = cache.read();
        const middleware = new Middleware(hexo, config);
        Object.values(cached).forEach((c) => {
          const path = stripIndex(c.path); // WARN: stripIndex() might not play nice with _config
          const directives = Directives.toString(c.directives);
          middleware.setReportUri(path, directives);
        });
        middleware.acceptReportMIME().logCSP();
      }
    }
  }
}
