const { policies } = require("../../lib/validation");
const fc = require("fast-check");
const { assert, objectTruthyKey } = require("../helpers/properties");
const Joi = require("joi");

const schema = Joi.object({ policies: policies(Joi.object().required()) });

const validate = (val) => schema.validate({ policies: val });

const badValue = () => {
  return fc.object({
    maxDepth: 0,
    values: [fc.anything().filter((v) => v?.constructor?.name !== "Object")],
  });
};

const validPolicy = () => ({ "foo/index.html": {}, "bar/index.html": {} });
const VALID = "{ [k: string]: {} }";

it(`should accept a policy that matches: ${VALID}`, () => {
  expect(validate(validPolicy()).error).not.toBeDefined();
});

it(`should accept multiple policies`, () => {
  assert(objectTruthyKey(fc.constant({})), (obj) => {
    fc.pre(Object.keys(obj).length > 0);
    expect(validate(obj).error).not.toBeDefined();
  });
});

it("should not allow empty objects", () => {
  expect(validate({}).error).toBeDefined();
});

it(`should return an error object when the value  isn't an object`, () => {
  assert(badValue(), (obj) => {
    expect(validate(obj).error).toBeDefined();
  });
});

it(`should only be an object or undefined`, () => {
  assert(fc.anything(), (obj) => {
    fc.pre(obj?.constructor?.name !== "Object" && obj !== undefined);
    expect(validate(obj).error).toBeDefined();
  });
});

it(`should be optional`, () => {
  expect(validate().error).not.toBeDefined();
});
