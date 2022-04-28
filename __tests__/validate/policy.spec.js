const { policy } = require("../../lib/validation");
const fc = require("fast-check");
const { assert } = require("../helpers/properties");
const Joi = require("joi");

const schema = Joi.object({
  policy: policy(Joi.string(), Joi.object()),
});

const validate = (val) => schema.validate({ policy: val });

const invalidPolicy = () => {
  return fc.object({
    key: fc.anything().filter((v) => typeof v !== "string"),
    maxDepth: 0,
    values: [
      fc.anything().filter(
        // strings and objects are valid, see the fake schema above
        (v) => typeof v !== "string" && v?.constructor?.name !== "Object"
      ),
    ],
  });
};

const validPolicy = (vals = {}) => ({
  ...{ mode: "merge", directives: {} },
  ...vals,
});

const validPolicyStr = (...args) => JSON.stringify(validPolicy(...args));

it(`should accept an object ${validPolicyStr()}`, () => {
  expect(validate(validPolicy()).error).not.toBeDefined();
});

it("should not allow empty objects", () => {
  expect(validate({}).error).toBeDefined();
});

it(`should return an error object when policy is not ${validPolicyStr()}`, () => {
  assert(invalidPolicy(), (obj) => {
    expect(validate(obj).error).toBeDefined();
  });
});

it(`should return an error object when mode is not a string`, () => {
  expect(validate(validPolicy({ mode: null })).error).toBeDefined();
});

it(`should return an error object when directives is not an object`, () => {
  expect(validate(validPolicy({ directives: null })).error).toBeDefined();
});
