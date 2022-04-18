"use strict";
const _merge = require("lodash.merge");

function merge(...opts) {
  return opts.reduce((prev, curr) => _merge(prev, curr));
}

module.exports = { merge };
