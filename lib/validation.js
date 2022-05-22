const Joi = require("joi");

// TODO: validate integrity; violation; report;
const enabled = Joi.boolean();
const priority = Joi.number().integer().strict(); // strict avoids casting to string
const source = Joi.string().min(1).required(); // just truthy
const sources = Joi.array().items(source).min(1).required(); // an empty array doesn't make sense
const env = Joi.string().valid("dev", "prod").default("prod");
const inlineEnabled = Joi.boolean();
const algo = Joi.string().valid("sha256", "sha384", "sha512");
const inline = (enabled, algo) => Joi.object({ enabled, algo });

// helpers
const array = (item) => Joi.array().items(item).min(1);

// policies
/*
- pattern: ^foo$      // policy
  dev:                // environment
    mode: str
    directives: {}
  prod: ...           // environment
*/
const environment = (mode, directives) => Joi.object({ mode, directives });

const policy = (env) =>
  Joi.object({
    pattern: Joi.string().min(1).required(),
    prod: env,
    dev: env,
  }).required();

const mode = () => Joi.string().valid("merge", "replace").default("merge");

const directives = (sources) =>
  Joi.object().pattern(Joi.string().min(1), sources).min(1).required();

const policies = array(policy(environment(mode(), directives(sources))));

const config = Joi.object({
  enabled,
  inline: inline(inlineEnabled, algo),
  priority,
  env,
  policies,
});

// helpers
const validatePolicies = (p) => policies.validate(p);
const validatePolicy = (p) =>
  policy(environment(mode(), directives(sources))).validate(p);

module.exports = {
  algo,
  env,
  config,
  enabled,
  inlineEnabled,
  priority,
  source,
  sources,
  directives,
  mode,
  policy,
  array,
  environment,
  validatePolicies,
  validatePolicy,
};
