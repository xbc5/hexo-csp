const { sources } = require("../../lib/validation");
const fc = require("fast-check");
const { assert } = require("../helpers/properties");
const Joi = require("joi");

const schema = Joi.object({ sources });

const validate = (val) => schema.validate({ sources: val });

it("should accept an array of strings", () => {
  assert(fc.array(fc.string({ minLength: 1 }), { minLength: 1 }), (val) => {
    expect(validate(val).error).not.toBeDefined();
  });
});

it("should not accept undefined", () => {
  expect(validate(undefined).error).toBeDefined();
});

it("should return an error object for values not: array", () => {
  assert(fc.anything(), (val) => {
    fc.pre(!Array.isArray(val));
    expect(validate(val).error).toBeDefined();
  });
});

it("should return an error object for empty array", () => {
  expect(validate([]).error).toBeDefined();
});

it("should return an error object for arrays containing non-strings", () => {
  assert(fc.array(fc.anything()), (val) => {
    fc.pre(val.every((v) => typeof v !== "string"));
    expect(validate(val).error).toBeDefined();
  });
});
