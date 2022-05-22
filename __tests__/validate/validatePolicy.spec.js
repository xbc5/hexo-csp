const { validatePolicy } = require("../../lib/validation");

const validate = (val) => validatePolicy(val);

const valid = () => ({
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
});

it("should accept a valid config", () => {
  expect(validate(valid()).error).toBeUndefined();
});

it("should reject if pattern is invalid", () => {
  const conf = valid();
  conf.pattern = null;
  expect(validate().error).toBeDefined();
});

["dev", "prod"].forEach((env) => {
  it("should reject if dev is invalid", () => {
    const conf = valid();
    conf[env] = null;
    expect(validate().error).toBeDefined();
  });

  it("should reject if dev.mode is invalid", () => {
    const conf = valid();
    conf[env].mode = null;
    expect(validate().error).toBeDefined();
  });

  it("should reject if dev.directives is invalid", () => {
    const conf = valid();
    conf[env].directives = null;
    expect(validate().error).toBeDefined();
  });

  it("should reject if dev.directives source is invalid", () => {
    const conf = valid();
    conf[env].directives.foo = null;
    expect(validate().error).toBeDefined();
  });
});
