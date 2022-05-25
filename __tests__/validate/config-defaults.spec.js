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

    ["enabled", "host", "port", "path"].forEach((key) => {
      describe(`for the "${env}" logger`, () => {
        const defaultValue = $DF.logger[env][key];
        const not = defaultValue === undefined ? " not" : "";
        it(`should${not} default the "${key}" value`, async () => {
          // if the default value doesn't exist (undefined) then we shall delete it
          // from expected. Essentially this also tests that a default is NOT set where
          // appropriate.
          const defaulted = defaultValue !== undefined;

          const conf = valid();
          delete conf.logger[env][key];

          const result = validate(conf).value;

          defaulted
            ? expect(result).toMatchObject({
                logger: { [env]: { [key]: defaultValue } },
              })
            : expect(Object.keys(result.logger[env])).not.toContain(key);
        });
      });
    });
  });
});

describe("when config is undefined", () => {
  it("should provide adequate defaults", async () => {
    const result = validate(undefined).value;
    expect(result).toStrictEqual($DF);
  });
});
