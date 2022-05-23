"use strict";

const Config = require("./config");

module.exports = function (config) {
  return new Config(config);
};
