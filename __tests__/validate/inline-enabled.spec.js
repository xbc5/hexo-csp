const { inlineEnabled } = require("../../lib/validation");
const fc = require("fast-check");
const { assert } = require("../helpers/properties");
const Joi = require("joi");

const schema = Joi.object({ enabled: inlineEnabled });

const validate = (val) => schema.validate({ enabled: val });

it("should accept booleans", () => {
  assert(fc.boolean(), (val) => {
    expect(validate(val).error).not.toBeDefined();
  });
});

it("should accept undefined", () => {
  expect(validate(undefined).error).not.toBeDefined();
});

it("should return an error object for values not: undefined, boolean", () => {
  assert(fc.anything(), (val) => {
    fc.pre(typeof val !== "boolean" && val !== undefined);
    expect(validate(val).error).toBeDefined();
  });
});
