"use strict";

const Config = require("../../lib/config");

it("should reject an invalid config", async () => {
  const validator = jest.fn();
  const c = new Config({ csp: {} }, validator);
  expect(validator).not.toHaveBeenCalled();
  c.validate();
  expect(validator).toHaveBeenCalledTimes(1);
});
