const fc = require("fast-check");

assert = (arb, expecter) => {
  fc.assert(
    fc.property(arb, (a) => {
      expecter(a);
    }),
    { verbose: true }
  );
};

truthyString = () => fc.string({ minLength: 1 }).filter((s) => !/^ *$/.test(s));

objectTruthyKey = (values, opts) =>
  fc.object({
    ...{ key: truthyString(), maxDepth: 0, values: [values] },
    ...opts,
  });

notAnObject = () =>
  fc.anything().filter((v) => v?.constructor?.name !== "Object");

module.exports = {
  assert,
  truthyString,
  objectTruthyKey,
  notAnObject
};
