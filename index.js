"use strict";
const config = hexo.config;
const { inject } = require("./lib/parser");
const { merge } = require("./lib");

function meta(...directives) {
  return (
    '<meta http-equiv="Content-Security-Policy" ' +
    `content="${directives.join("; ")}">`
  );
}

if (config.csp?.enabled) {
  const defaultOpts = {
    directives: { "default-src": "'self'" },
  };
  hexo.extend.filter.register("after_render:html", function run(str, data) {
    const hexo = this;
    const options = merge(defaultOpts, hexo.config.csp);
    const path = data.path;
    const log = hexo.log || console;

    return inject(str, meta());
  });
}
