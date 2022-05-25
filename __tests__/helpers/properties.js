const fc = require("fast-check");

const assert = (arb, expecter) => {
  fc.assert(
    fc.property(arb, (a) => {
      expecter(a);
    }),
    { verbose: true }
  );
};

const truthyString = () =>
  fc.string({ minLength: 1 }).filter((s) => !/^ *$/.test(s));

const objectTruthyKey = (values, opts) =>
  fc.object({
    ...{ key: truthyString(), maxDepth: 0, values: [values] },
    ...opts,
  });

const notAnObject = () =>
  fc.anything().filter((v) => v?.constructor?.name !== "Object");

const notAString = () => fc.anything().filter((v) => typeof v !== "string");
const notA = (type) => fc.anything().filter((v) => typeof v !== type);
const notIntegers = () => fc.anything().filter((v) => !Number.isInteger(v));

const garbageObject = () => {
  return fc.object({
    key: truthyString(),
    maxDepth: 0,
    values: [fc.anything()],
  });
};

module.exports = {
  assert,
  truthyString,
  objectTruthyKey,
  notAnObject,
  notAString,
  garbageObject,
  notA,
  notIntegers,
};
