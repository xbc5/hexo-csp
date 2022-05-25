const { loggerEnv } = require("../../lib/validation");
const { assert, garbageObject } = require("../helpers/properties");
const Joi = require("joi");

const str = () => Joi.string().required();

const schema = () =>
  Joi.object({
    env: loggerEnv(str(), str(), str(), str()),
  });

const validate = (val) => schema().validate({ env: val });

// these are arbitrary values for testing
const valid = () => ({
  enabled: "enabled",
  host: "host",
  port: "port",
  path: "path",
});

it("should accept valid values", () => {
  expect(validate(valid()).error).not.toBeDefined();
});

Object.keys(valid()).forEach((key) => {
  it(`should reject invalid "${key}" value`, () => {
    const val = valid();
    val[key] = null;
    expect(validate(val).error).toBeDefined();
  });
});

it("should reject bad object shape", () => {
  assert(garbageObject(), (val) => {
    expect(validate(val).error).toBeDefined();
  });
});
