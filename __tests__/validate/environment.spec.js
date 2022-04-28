const { environment } = require("../../lib/validation");
const fc = require("fast-check");
const { assert, notAnObject } = require("../helpers/properties");
const Joi = require("joi");

const schema = Joi.object({
  environment: environment(Joi.object().required()),
});

const validate = (val) => schema.validate({ environment: val });

const validEnv = () => ({ policies: {} });
const VALID = "{ policies: object }";

it(`should accept a policy that matches: ${VALID}`, () => {
  expect(validate(validEnv()).error).not.toBeDefined();
});

it("should not accept empty objects", () => {
  expect(validate({}).error).toBeDefined();
});

it(`should return an error object when policies isn't an object`, () => {
  assert(notAnObject(), (policies) => {
    expect(validate({ policies }).error).toBeDefined();
  });
});

it(`should only be an object or undefined`, () => {
  assert(fc.anything(), (any) => {
    fc.pre(any?.constructor?.name !== "Object" && any !== undefined);
    expect(validate(any).error).toBeDefined();
  });
});

it(`should be optional`, () => {
  expect(validate().error).not.toBeDefined();
});
