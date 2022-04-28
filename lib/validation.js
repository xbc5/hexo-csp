const Joi = require("joi");

// TODO: validate integrity; violation; report;
const enabled = Joi.boolean();
const priority = Joi.number().integer().strict(); // strict avoids casting to string
const source = Joi.string().min(1).required(); // just truthy
const sources = Joi.array().items(source).min(1).required(); // an empty array doesn't make sense

const directives = (sources) =>
  Joi.object().pattern(Joi.string().min(1), sources).min(1);

const mode = () => Joi.string().valid("merge", "replace").default("merge");
const env = Joi.string().valid("dev", "prod").default("prod");

const policy = (mode, directives) =>
  Joi.object({ mode, directives: directives.required() });

const policies = (policy) =>
  Joi.object().pattern(Joi.string().min(1), policy).min(1);

const environment = (policies) => Joi.object({ policies });

const policiesValidator = policies(policy(mode(), directives(sources)));

const config = Joi.object({
  enabled,
  priority,
  env,
  prod: environment(policiesValidator),
  dev: environment(policies(policy(mode(), directives(sources)))),
});

// helpers
const validatePolicies = (p) => policiesValidator.validate(p);

module.exports = {
  env,
  config,
  enabled,
  priority,
  source,
  sources,
  directives,
  mode,
  policy,
  policies,
  environment,
  validatePolicies,
};
