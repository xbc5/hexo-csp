"use strict";
const { inject } = require("./lib/parser");
const Config = require("./lib/config");

const config = new Config(hexo.config);

function meta(...directives) {
  return (
    '<meta http-equiv="Content-Security-Policy" ' +
    `content="${directives.join("; ")}">`
  );
}

if (config.enabled) {
  hexo.extend.filter.register(
    "after_render:html",
    function run(str, data) {
      const hexo = this;
      const path = data.path;
      const log = hexo.log || console;

      return inject(str, meta());
    },
    config.priority
  );
}
