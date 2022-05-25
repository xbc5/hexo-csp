const { port } = require("../../lib/validation");
const fc = require("fast-check");
const { assert, notIntegers } = require("../helpers/properties");
const Joi = require("joi");

const schema = Joi.object({ port: port() });

const validate = (val) => schema.validate({ port: val });

it("should accept numbers", () => {
  assert(fc.integer({ min: 1, max: 65535 }), (val) => {
    expect(validate(val).error).not.toBeDefined();
  });
});

it("should accept undefined", () => {
  expect(validate(undefined).error).not.toBeDefined();
});

it("should reject numbers < 1", () => {
  assert(fc.integer({ max: 0 }), (val) => {
    expect(validate(val).error).toBeDefined();
  });
});

it("should reject numbers > 65535", () => {
  assert(fc.integer({ min: 65536 }), (val) => {
    expect(validate(val).error).toBeDefined();
  });
});

it("should reject non-integers", () => {
  assert(notIntegers(), (val) => {
    fc.pre(val !== undefined); // can be undefined
    expect(validate(val).error).toBeDefined();
  });
});
