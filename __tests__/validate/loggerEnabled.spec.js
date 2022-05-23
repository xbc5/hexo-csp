const { loggerEnabled } = require("../../lib/validation");
const fc = require("fast-check");
const { assert, notA } = require("../helpers/properties");
const Joi = require("joi");

const schema = (_default) => Joi.object({ enabled: loggerEnabled(_default) });

const validate = (val, _default = false) =>
  schema(_default).validate({ enabled: val });

it("should accept booleans", () => {
  assert(fc.boolean(), (val) => {
    expect(validate(val).error).not.toBeDefined();
  });
});

[true, false].forEach((val) => {
  it(`should default to ${val} when specified`, () => {
    expect(validate(undefined, val).value.enabled).toBe(val);
  });
});

it("should reject non-booleans", () => {
  assert(notA("boolean"), (val) => {
    fc.pre(val !== undefined); // is optional, so ignore this too
    expect(validate(val).error).toBeDefined();
  });
});
