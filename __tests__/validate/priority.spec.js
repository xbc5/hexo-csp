const { priority } = require("../../lib/validation");
const fc = require("fast-check");
const { assert } = require("../helpers/properties");
const Joi = require("joi");

const schema = Joi.object({ priority });

const validate = (val) => schema.validate({ priority: val });

it("should accept integers", () => {
  assert(fc.integer(), (val) => {
    expect(validate(val).error).not.toBeDefined();
  });
});

it("should reject non-integer numbers", () => {
  assert(fc.oneof(fc.float(), fc.bigInt(), fc.bigUint()), (val) => {
    fc.pre(val !== 0);
    expect(validate(val).error).toBeDefined();
  });
});

it("should accept undefined", () => {
  expect(validate(undefined).error).not.toBeDefined();
});

it('should not accept "0" (string number)', () => {
  expect(validate("0").error).toBeDefined();
});

it("should return an error object for values not: number", () => {
  assert(fc.anything(), (val) => {
    fc.pre(typeof val !== "number" && val !== undefined);
    expect(validate(val).error).toBeDefined();
  });
});
