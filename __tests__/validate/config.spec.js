const { config } = require("../../lib/validation");
const { validConfig: valid } = require("./helpers");

const validate = (val) => config.validate(val);

it("should accept a valid config", () => {
  const err = validate(valid()).error;
  expect(err).not.toBeDefined();
});

const set = (path, value = null) => {
  const conf = valid();

  const split = path.split(".");
  const end = split[split.length - 1];
  const rest = split.slice(0, split.length - 1);

  const almost = rest.reduce((p, c) => (p && p[c]) || null, conf);
  if (almost === null) throw Error(`Invalid path for config object: ${path}`);

  value === "delete" ? delete almost[end] : (almost[end] = value);
  return conf;
};

[
  "enabled",
  "env",
  "inline",
  "inline.algo",
  "inline.enabled",
  "priority",
  "policies",
  "logger",
  "logger.dev",
  "logger.dev.enabled",
  "logger.dev.uri",
  "logger.prod",
  "logger.prod.enabled",
  "logger.prod.uri",
].forEach((path) => {
  describe("keys that should error when set with an invalid value", () => {
    it(`should error when ${path}=null`, () => {
      const conf = set(path);
      expect(validate(conf).error).toBeDefined();
    });
  });
});

["logger.prod.uri"].forEach((path) => {
  describe("keys that should error when they don't exist", () => {
    test(path, () => {
      const conf = set(path, "delete");
      expect(validate(conf).error).toBeDefined();
    });
  });
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
