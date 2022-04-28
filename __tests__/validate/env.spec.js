const { env } = require("../../lib/validation");
const fc = require("fast-check");
const { assert } = require("../helpers/properties");
const Joi = require("joi");

const schema = Joi.object({ env });

const validate = (val) => schema.validate({ env: val });

it("should accept 'prod'", () => {
  expect(validate("prod").error).not.toBeDefined();
});

it("should accept 'dev'", () => {
  expect(validate("dev").error).not.toBeDefined();
});

it("should accept undefined", () => {
  expect(validate(undefined).error).not.toBeDefined();
});

it("should return an error object for values not: undefined, 'prod', or 'dev'", () => {
  assert(fc.anything(), (val) => {
    fc.pre(![undefined, "prod", "dev"].includes(val));
    expect(validate(val).error).toBeDefined();
  });
});
