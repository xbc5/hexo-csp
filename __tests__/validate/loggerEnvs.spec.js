const { loggerEnvs } = require("../../lib/validation");
const { assert, garbageObject } = require("../helpers/properties");
const Joi = require("joi");

const schema = () =>
  Joi.object({
    env: loggerEnvs(Joi.string().required(), Joi.string().required()),
  });

const validate = (val) => schema().validate({ env: val });

// these are arbitrary values for testing
const valid = () => ({ prod: "prod", dev: "dev" });

it("should accept valid values", () => {
  expect(validate(valid()).error).not.toBeDefined();
});

["prod", "dev"].forEach((key) => {
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
