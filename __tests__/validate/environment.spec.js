const { environment } = require("../../lib/validation");
const fc = require("fast-check");
const { assert, notAnObject, notAString } = require("../helpers/properties");
const Joi = require("joi");

// NOTE: just test that environment validates SOMETHING -- its values are placeholders here.

const schema = Joi.object({
  environment: environment(
    // mode and directives use placeholders for this suite
    Joi.string().min(1).required(),
    Joi.object().required()
  ),
});

const validate = (val) => schema.validate({ environment: val });

const validEnv = () => ({ mode: "mode", directives: {} });
const VALID = "{ mode: string, directives: object }";

it(`should accept an object that matches: ${VALID}`, () => {
  expect(validate(validEnv()).error).not.toBeDefined();
});

it(`should be optional`, () => {
  expect(validate().error).not.toBeDefined();
});

it(`should reject invalid "directives" values`, () => {
  // remember that directives is a dummy schema for this suite
  assert(notAnObject(), (directives) => {
    expect(validate({ directives, mode: "mode" }).error).toBeDefined();
  });
});

it(`should reject invalid "mode" values`, () => {
  // remember that mode is a dummy schema for this suite
  assert(notAString(), (mode) => {
    expect(validate({ mode, directives: {} }).error).toBeDefined();
  });
});

it(`should reject invalid root values`, () => {
  // i.e. not object values, but the arg itself
  assert(fc.anything(), (any) => {
    fc.pre(any?.constructor?.name !== "Object" && any !== undefined);
    expect(validate(any).error).toBeDefined();
  });
});
