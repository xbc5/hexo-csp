const { source } = require("../../lib/validation");
const fc = require("fast-check");
const { assert } = require("../helpers/properties");
const Joi = require("joi");

const schema = Joi.object({ source });

const validate = (val) => schema.validate({ source: val });

it("should accept strings", () => {
  assert(fc.string({ minLength: 1 }), (val) => {
    expect(validate(val).error).not.toBeDefined();
  });
});

it("should not accept undefined", () => {
  expect(validate(undefined).error).toBeDefined();
});

it("should return an error object for values not: string", () => {
  assert(fc.anything(), (val) => {
    fc.pre(typeof val !== "string");
    expect(validate(val).error).toBeDefined();
  });
});
