"use strict";

function setConfig(hexo, enabled) {
  if (hexo.config.csp === undefined) {
    hexo.config.csp = {};
  }

  if (enabled === true) {
    hexo.config.csp.env = "dev";
  } else {
    hexo.config.csp.env = "prod";
  }
}

function registerCli(hexo) {
  const generate = hexo.extend.console.store.generate;
  const genOpts = generate.options.options;
  const genDesc = generate.desc;

  // hook into generate command to extend it
  function fn(args) {
    let cspDev = args.s || args["csp-dev"];
    setConfig(hexo, cspDev);
    generate.call(this, args);
  }

  const _options = {
    desc: genDesc,
    options: [
      ...genOpts,
      { name: "-s, --csp-dev", desc: "Enable development CSP policies" },
    ],
  };
  hexo.extend.console.register(
    "generate",
    "Generate static files.",
    _options,
    fn
  );
}

module.exports = { registerCli };
