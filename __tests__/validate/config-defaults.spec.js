const { config } = require("../../lib/validation");
const { validConfig: valid } = require("./helpers");
const $DF = require("../../lib/defaults");

const validate = (val) => config.validate(val);

describe("logger", () => {
  it("should default when it's undefined", async () => {
    const conf = valid();
    delete conf.logger;

    const result = validate(conf).value;
    expect(result).toMatchObject({ logger: $DF.logger });
  });

  ["dev", "prod"].forEach((env) => {
    it(`should default for ${env} logger`, async () => {
      const conf = valid();
      delete conf.logger[env];

      const expected = { logger: { [env]: $DF.logger[env] } };

      const result = validate(conf).value;
      expect(result).toMatchObject(expected);
    });

    it(`should default "enabled" value for ${env} logger`, async () => {
      const conf = valid();
      delete conf.logger[env].enabled;

      const expected = {
        logger: { [env]: { enabled: $DF.logger[env].enabled } },
      };

      const result = validate(conf).value;
      expect(result).toMatchObject(expected);
    });

    it(`should default "uri" value for ${env} logger`, async () => {
      const conf = valid();
      delete conf.logger[env].uri;

      const uri = $DF.logger[env].uri;

      // in cases where it's not required we expect no key, not { key: undefined }
      const expected = uri === undefined ? {} : { logger: { [env]: { uri } } };

      const result = validate(conf).value;
      expect(result).toMatchObject(expected);
    });
  });
});

describe("when config is undefined", () => {
  it("should provide adequate defaults", async () => {
    const result = validate(undefined).value;
    expect(result).toStrictEqual($DF);
  });
});
