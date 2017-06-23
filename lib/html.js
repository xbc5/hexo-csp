"use strict";

const cloneDeep = require("lodash.clonedeep");

function run(str, data) {
  const hexo = this;
  const options = cloneDeep(hexo.config.asset_pipeline.html_minifier);
  const path = data.path;
  const log = hexo.log || console;

  try {
  } catch (e) {}

  return str;
}

module.exports = run;
