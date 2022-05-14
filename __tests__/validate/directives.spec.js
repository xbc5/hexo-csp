const { directives } = require("../../lib/validation");
const fc = require("fast-check");
const { assert } = require("../helpers/properties");
const Joi = require("joi");

// inject schema to isolate this test from the rest of the schema
const schema = Joi.object({ directives: directives(Joi.array().required()) });

const validate = (val) => schema.validate({ directives: val });

const directive = (sources = fc.array(fc.string())) => {
  return fc.object({
    key: fc.string({ minLength: 1 }).filter((s) => /^ *$/.test(s)),
    maxDepth: 0,
    values: [sources],
  });
};

const notArrayValues = (obj) =>
  Object.values(obj).every((v) => !Array.isArray(v));
const hasKeys = (obj) => Object.keys(obj).length > 0;

it("should accept an object, with any truthy string key", () => {
  assert(directive(), (obj) => {
    fc.pre(hasKeys(obj));
    expect(validate(obj).error).not.toBeDefined();
  });
});

it("should not allow empty objects", () => {
  expect(validate({}).error).toBeDefined();
});

it("should not allow undefined value", () => {
  expect(validate(undefined).error).toBeDefined();
});

it("should return an error object for invalid source value", () => {
  assert(directive(fc.anything()), (obj) => {
    fc.pre(notArrayValues(obj));
    expect(validate(obj).error).toBeDefined();
  });
});
