const { policy } = require("../../lib/validation");
const fc = require("fast-check");
const { assert, garbageObject } = require("../helpers/properties");
const Joi = require("joi");

const schema = Joi.object({
  policy: policy(Joi.object()),
});

const validate = (val) => schema.validate({ policy: val });

const validPolicy = (vals = {}) => ({
  ...{ pattern: "^pattern$", prod: {}, dev: {} },
  ...vals,
});

const validPolicyStr = () => JSON.stringify(validPolicy());

it(`should accept a valid object: ${validPolicyStr()}`, () => {
  expect(validate(validPolicy()).error).not.toBeDefined();
});

it("should reject empty objects", () => {
  expect(validate({}).error).toBeDefined();
});

it("should reject misshaped objects", () => {
  assert(garbageObject(), (a) => {
    expect(validate(a).error).toBeDefined();
  });
});

it("should be mandatory", () => {
  expect(validate(undefined).error).toBeDefined();
});

it("should reject if 'pattern' is undefined", () => {
  expect(validate(validPolicy({ pattern: undefined })).error).toBeDefined();
});

it("should accept if 'prod' is undefined", () => {
  expect(validate(validPolicy({ prod: undefined })).error).not.toBeDefined();
});

it("should accept if 'dev' is undefined", () => {
  expect(validate(validPolicy({ dev: undefined })).error).not.toBeDefined();
});
