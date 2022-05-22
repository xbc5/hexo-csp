"use strict";
const Config = require("../../lib/config");

[null, undefined].forEach((arg) => {
  test(`that he config handle ${
    arg === undefined ? "undefined" : "null"
  }`, () => {
    expect(() => new Config(arg)).not.toThrow();
  });
});
