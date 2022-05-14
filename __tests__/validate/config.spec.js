const { config } = require("../../lib/validation");

const validate = (val) => config.validate(val);

const valid = () => ({
  enabled: true,
  inline: {
    enabled: true,
    algo: "sha512",
  },
  priority: 100,
  env: "prod",
  policies: [
    {
      pattern: "^foo$",
      prod: {
        mode: "replace",
        directives: {
          "default-src": ["https://foo.com", "https://bar.com"],
          "img-src": ["https://foo.com", "https://bar.com"],
        },
      },
      dev: {
        directives: {
          "default-src": ["https://bar.com"],
        },
      },
    },
    {
      pattern: "^bar$",
      prod: {
        mode: "merge",
        directives: {
          "img-src": ["https://foo.com"],
        },
      },
      dev: {
        mode: "merge",
        directives: {
          "img-src": ["https://foo.com"],
        },
      },
    },
  ],
});

it("should accept a valid config", () => {
  const err = validate(valid()).error;
  expect(err).not.toBeDefined();
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

it("should return an error object for invalid 'inline' prop", () => {
  const conf = valid();
  conf.inline = null;
  expect(validate(conf).error).toBeDefined();
});

it("should return an error object for invalid 'inline.algo' prop", () => {
  const conf = valid();
  conf.inline.algo = null;
  expect(validate(conf).error).toBeDefined();
});

it("should return an error object for invalid 'inline.enabled' prop", () => {
  const conf = valid();
  conf.inline.enabled = null;
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
      conf.policies.map((p) => (p[env] = null));
      expect(validate(conf).error).toBeDefined();
    });

    it("should be optional", () => {
      const conf = valid();
      conf.policies.map((p) => delete p[env]);
      expect(validate(conf).error).not.toBeDefined();
    });

    it("should return an error object for invalid 'policies' prop", () => {
      const conf = valid();
      conf.policies = null;
      expect(validate(conf).error).toBeDefined();
    });

    it("should accept the policies prop as optional", () => {
      const conf = valid();
      delete conf.policies;
      expect(validate(conf).error).not.toBeDefined();
    });

    it("should return an error object for invalid pattern value", () => {
      const conf = valid();
      conf.policies.map((p) => (p[env].pattern = null));
      expect(validate(conf).error).toBeDefined();
    });

    it("should return an error object for invalid 'directives' prop", () => {
      const conf = valid();
      conf.policies.map((p) => (p[env].directives = null));
      expect(validate(conf).error).toBeDefined();
    });

    it("should return an error object for missing 'directives'", () => {
      const conf = valid();
      conf.policies.map((p) => delete p[env].directives);
      expect(validate(conf).error).toBeDefined();
    });

    it("should return an error object for invalid 'mode' prop", () => {
      const conf = valid();
      conf.policies.map((p) => (p[env].mode = null));
      expect(validate(conf).error).toBeDefined();
    });

    it("should allow an undefined mode", () => {
      const conf = valid();
      conf.policies.map((p) => delete p[env].mode);
      expect(validate(conf).error).not.toBeDefined();
    });

    it("should return an error object for invalid source value", () => {
      const conf = valid();
      conf.policies.map((p) => (p[env].directives["default-src"] = null));
      expect(validate(conf).error).toBeDefined();
    });
  });
});
