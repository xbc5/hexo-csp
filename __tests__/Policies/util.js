const Policies = require("../../lib/Policies");

const factory = (opts) => new Policies({ env: "dev", ...opts });

const initial = () => [
  {
    pattern: "^foo$",
    mode: "merge",
    directives: {
      "default-src": ["https://default-foo-base.com"],
      "img-src": ["https://img-foo-base.com"],
    },
  },
  {
    pattern: "^bar$",
    mode: "merge",
    directives: {
      "default-src": ["https://default-bar-base.com"],
      "img-src": ["https://img-bar-base.com"],
    },
  },
];

const arg = () => [
  {
    pattern: "^foo$",
    mode: "merge",
    directives: {
      "default-src": ["https://default-foo-arg.com"],
      "img-src": ["https://img-foo-arg.com"],
    },
  },
  {
    pattern: "^bar$",
    mode: "merge",
    directives: {
      "default-src": ["https://default-bar-arg.com"],
      "img-src": ["https://img-bar-arg.com"],
    },
  },
];

module.exports = { factory, initial, arg };
