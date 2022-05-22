"use strict";

const Config = require("./config");
const { config: schema } = require("./validation");

module.exports = function (config) {
  return new Config(config, (c) => schema.validate(c));
};
