const { factory } = require("./util");

const validInput = () => ({
  pattern: "^foo$",
  prod: {
    mode: "merge",
    directives: {
      "img-src": ["https://prod-img-1.com"],
      "default-src": ["https://prod-default-1.com"],
    },
  },
  dev: {
    mode: "merge",
    directives: {
      "img-src": ["https://dev-img-1.com"],
      "default-src": ["https://dev-default-1.com"],
    },
  },
});

it("should be defined", async () => {
  const policies = factory();
  expect(policies.combineEnvs).toBeDefined();
});

[
  { env: "dev", mode: "merge" },
  { env: "prod", mode: "merge" },
  { env: "dev", mode: "replace" },
  { env: "prod", mode: "replace" },
].forEach(({ mode, env }) => {
  // this will test each path through the function, which, for each,
  // it creates/uses an object -- which is vulnerable to external manipulation
  // after the fact.
  describe("for the given mode and env", () => {
    describe(`env=${env}; mode=${mode}`, () => {
      it("should not directly manipulate the given subject", async () => {
        const policies = factory({ env });
        const arg = validInput();
        arg.dev.mode = mode;
        const result = policies.combineEnvs(arg);

        // change it after the fact
        arg.pattern = "changed";
        arg.dev.mode = "changed";
        arg.prod.mode = "changed";
        arg.dev.directives.changed = null;
        arg.prod.directives.changed = null;
        arg.dev.directives["default-src"].push("changed");
        arg.prod.directives["default-src"].push("changed");

        const patternChanged = result.pattern === "changed";
        const modeChanged = result.mode === "changed";
        const directivesChanged = result.directives.changed === null;
        const directivesAdded =
          result.directives["default-src"].includes("changed");

        expect(patternChanged).toBe(false);
        expect(modeChanged).toBe(false);
        expect(directivesChanged).toBe(false);
        expect(directivesAdded).toBe(false);
      });

      it("should return a FlatPolicy with expected values", async () => {
        // check the full shape of the result in this test
        const input = validInput();
        input.dev.mode = mode;

        const result = factory({ env }).combineEnvs(input);

        expect(result).toMatchSnapshot();
      });

      const negateMode = (mode) => (mode === "replace" ? "merge" : "replace");

      it("should set prod's mode in the result", async () => {
        // this function preserve whatever mode is set on the prod.mode key.
        // when dev.mode is replace, that takes precedence, so expect that.
        const input = validInput();
        const isDev = env === "dev";
        const devMode = mode;

        // set prods mode as opposite of devs, to easily distinguish it in results
        const prodMode = negateMode(devMode);
        let expectedMode; // the final result, after combining

        if (isDev) {
          // "replace" for dev mode takes precedence, and will always overwrite prods mode
          expectedMode = devMode === "replace" ? devMode : prodMode;
        } else {
          // this is prod env, and dev config is ignored, so just expect prods mode to be used.
          expectedMode = prodMode;
        }

        input.prod.mode = prodMode;
        input.dev.mode = devMode; // dev.mode governs merging between environments

        const expected = { mode: expectedMode };

        const result = factory({ env }).combineEnvs(input);
        expect(result).toMatchObject(expected);
      });
    });
  });
});

const env = () => ({
  mode: "replace",
  directives: {
    "default-src": ["https://example.com"],
  },
});

[
  { env: "dev", envs: { dev: undefined, prod: env() }, throws: false },
  { env: "dev", envs: { dev: env(), prod: undefined }, throws: false },
  { env: "dev", envs: { dev: undefined, prod: undefined }, throws: true },
  { env: "prod", envs: { dev: undefined, prod: env() }, throws: false },
  { env: "prod", envs: { dev: env(), prod: undefined }, throws: true },
  { env: "prod", envs: { dev: undefined, prod: undefined }, throws: true },
].forEach(({ env, envs, throws }) => {
  const envMsg = (e) =>
    envs[e] === undefined ? `${e}=undefined` : `${e}=defined`;
  const argDesc = `${envMsg("dev")}; ${envMsg("prod")}`;
  const throwMsg = throws ? "should throw" : "should not throw";

  describe(`for undefined env keys`, () => {
    describe(`where env=${env} and ${argDesc}`, () => {
      it(throwMsg, async () => {
        const input = {
          ...validInput(),
          ...envs,
        };
        const fn = () => factory({ env }).combineEnvs(input);
        throws ? expect(fn).toThrow() : expect(fn).not.toThrow();
      });
    });
  });
});
