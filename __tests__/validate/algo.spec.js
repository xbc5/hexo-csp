const { algo } = require("../../lib/validation");
const fc = require("fast-check");
const { assert } = require("../helpers/properties");
const Joi = require("joi");

const schema = Joi.object({ algo });

const validate = (val) => schema.validate({ algo: val });

const ARGS = [undefined, "sha256", "sha384", "sha512"];

ARGS.forEach((arg) => {
  const a = arg || "undefined";
  it(`should accept "${a}"`, () => {
    expect(validate(arg).error).not.toBeDefined();
  });
});

ARGS_STR = ARGS.map((a) => (a === undefined ? "undefined" : a)).join(", ");
it(`should return an error object for values not: ${ARGS_STR}`, () => {
  assert(fc.anything(), (val) => {
    fc.pre(!ARGS.includes(val));
    expect(validate(val).error).toBeDefined();
  });
});
