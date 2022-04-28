const { mode } = require("../../lib/validation");
const fc = require("fast-check");
const { assert } = require("../helpers/properties");
const Joi = require("joi");

const schema = Joi.object({ mode: mode() });

const validate = (val) => schema.validate({ mode: val });

it("should accept 'merge'", () => {
  expect(validate("merge").error).not.toBeDefined();
});

it("should accept 'replace'", () => {
  expect(validate("replace").error).not.toBeDefined();
});

it("should accept undefined", () => {
  expect(validate(undefined).error).not.toBeDefined();
});

it("should return an error object for values not: undefined, 'merge', or 'replace'", () => {
  assert(fc.anything(), (val) => {
    fc.pre(![undefined, "merge", "replace"].includes(val));
    expect(validate(val).error).toBeDefined();
  });
});
