const { loggerPath } = require("../../lib/validation");
const fc = require("fast-check");
const { assert, truthyString, notAString } = require("../helpers/properties");
const Joi = require("joi");

const schema = Joi.object({ path: loggerPath() });

const validate = (val) => schema.validate({ path: val });

it("should accept strings", () => {
  assert(truthyString(), (val) => {
    expect(validate(val).error).not.toBeDefined();
  });
});

it("should reject falsy strings", () => {
  expect(validate("").error).toBeDefined();
});

it("should not be required", () => {
  // because path is required for prod logger, but not dev, this is enfoced
  // during inteeration (validate/config), so test it there instead.
  expect(validate(undefined).error).not.toBeDefined();
});

it("should reject non-strings", () => {
  assert(notAString(), (val) => {
    fc.pre(val !== undefined);
    expect(validate(val).error).toBeDefined();
  });
});
