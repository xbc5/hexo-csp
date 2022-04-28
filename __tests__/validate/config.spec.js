const { config } = require("../../lib/validation");

const validate = (val) => config.validate(val);

const valid = () => ({
  enabled: true,
  priority: 100,
  env: "prod",
  prod: {
    policies: {
      default: {
        mode: "replace",
        directives: {
          "default-src": ["https://foo.com", "https://bar.com"],
          "img-src": ["https://foo.com", "https://bar.com"],
        },
      },
      "foo/index.html": {
        mode: "merge",
        directives: {
          "img-src": ["https://foo.com"],
        },
      },
    },
  },
  dev: {
    policies: {
      default: {
        directives: {
          "default-src": ["https://bar.com"],
        },
      },
      "bar/index.html": {
        mode: "merge",
        directives: {
          "img-src": ["https://foo.com"],
        },
      },
    },
  },
});

it("should accept a valid config", () => {
  expect(validate(valid()).error).not.toBeDefined();
});

it("should return an error object for invalid 'enabled' prop", () => {
  const conf = valid();
  conf.enabled = null;
  expect(validate(conf).error).toBeDefined();
});

it("should return an error object for invalid 'env' prop", () => {
  const conf = valid();
  conf.enabled = null;
  expect(validate(conf).error).toBeDefined();
});

it("should return an error object for invalid 'priority' prop", () => {
  const conf = valid();
  conf.priority = null;
  expect(validate(conf).error).toBeDefined();
});

["prod", "dev"].forEach((env) => {
  describe(`for the ${env} key`, () => {
    it("should return an error object when it's invalid", () => {
      const conf = valid();
      conf[env] = null;
      expect(validate(conf).error).toBeDefined();
    });

    it("should be optional", () => {
      const conf = valid();
      conf[env] = undefined;
      expect(validate(conf).error).not.toBeDefined();
    });

    it("should return an error object for invalid 'policies' prop", () => {
      const conf = valid();
      conf[env].policies = null;
      expect(validate(conf).error).toBeDefined();
    });

    it("should return an error object for invalid 'policy' value", () => {
      const conf = valid();
      conf[env].policies.default = null;
      expect(validate(conf).error).toBeDefined();
    });

    it("should return an error object for invalid 'directives' prop", () => {
      const conf = valid();
      conf[env].policies.default.directives = null;
      expect(validate(conf).error).toBeDefined();
    });

    it("should return an error object if 'directives' key doesn't exist", () => {
      const conf = valid();
      delete conf[env].policies.default.directives;
      expect(validate(conf).error).toBeDefined();
    });

    it("should return an error object for invalid 'mode' prop", () => {
      const conf = valid();
      conf[env].policies.default.mode = null;
      expect(validate(conf).error).toBeDefined();
    });

    it("should return an error object for invalid source value", () => {
      const conf = valid();
      conf[env].policies.default.directives["default-src"] = null;
      expect(validate(conf).error).toBeDefined();
    });
  });
});
