"use strict";

const Config = require("./config");

module.exports = function (...args) {
  return new Config(...args);
};
