"use strict";

const { applyCSP } = require("./lib/markup");
const Config = require("./lib/config");
const { registerCli } = require("./lib/cli");

const config = new Config(hexo.config);

registerCli(hexo);

if (config.enabled) {
  hexo.extend.filter.register(
    "after_render:html",
    function run(str, data) {
      // TODO: you need to handle default path
      return applyCSP(config, data, str);
    },
    config.priority
  );
}
