"use strict";

const clone = require("lodash.clonedeep");

class Config {
  #config;
  #policies;
  #env;

  constructor(config = {}, env = "prod", logger = { warn: () => undefined }) {
    // enabled defaults to false, so if this defaults, then enabled: false.
    this.#config = config || {};
    this.#config = clone(this.#config);
    this.#env = Config.getEnv(env, logger);

    this.#policies = this.#config.policies;
  }

  /* Check if a production environment is set. Is true ONLY IF it's NOT a dev
   * environment. This means that production is the default if an explicit
   * dev environment is not used.
   *
   * @type {boolean}
   *
   */
  get isProd() {
    return this.env === "prod";
  }

  /* Check if a development environment is set. Define these in conf.csp.dev.env
   * as a list. If these are not specified, the defaults are dev, develop, development,
   * test, trace, and debug.
   *
   * @type {boolean}
   *
   */
  get isDev() {
    return this.env === "dev";
  }

  get env() {
    return this.#env;
  }

  static getEnv(env, log = { warn: () => undefined }) {
    const validProd = ["prod", "production"];
    const validDev = [
      "dev",
      "development",
      "trace",
      "debug",
      "test",
      "testing",
    ];
    const isProd = (env) => validProd.includes(env);
    const isDev = (env) => validDev.includes(env);

    if (!isProd(env) && !isDev(env)) {
      const validEnvs = validProd.concat(validDev);
      log.warn(
        `Invalid env '${env}', hexo-csp requires one of: ` +
          `${validEnvs.join("; ")}. Assuming "prod" env for CSP policies.`
      );
      return "prod";
    }
    if (isProd(env)) return "prod";
    if (isDev(env)) return "dev";
    throw Error(`Invalid env: "${env}"`);
  }

  /**
   * The priority given to the filter. We want any inline code to be in
   * its final form before we compute a hash, so the filter should have a low
   * priority (run last). The hexo-asset-pipeline runs with the default priority
   * of 10, this transforms the code and affects the hash. This priority should be
   * lower (bigger number) than that.
   *
   * Defaults to 999.
   *
   * @type {number}
   */
  get priority() {
    return this.#config.priority || 999;
  }

  /**
   * Enable/disable the generator entirely. Defaults to false.
   *
   * @type {boolean}
   */
  get enabled() {
    return this.#config.enabled || false;
  }

  /**
   * Get all unmodified policies as specified in the config.
   * This is a clone.
   *
   * @example
   * [
   *   {
   *     pattern: string,
   *     prod: {
   *       mode: merge|replace,
   *       directives: Object,
   *     },
   *     dev: {
   *       mode: merge|replace,
   *       directives: Object,
   *     }
   *   },
   *   ...
   * ]
   *
   * @type {Object}
   */
  get policies() {
    return clone(this.#policies) || [];
  }

  get algo() {
    return this.#config.inline?.algo || "sha256";
  }

  get inline() {
    return this.#config.inline?.enabled || false;
  }

  #validateEnv(env) {
    if (!["prod", "dev"].includes(env)) throw Error(`Invalid env arg: ${env}`);
  }

  #defined(v, msg) {
    if (v === null || v === undefined) {
      throw Error(msg + " -- ensure that it's validated and defaulted.");
    }
    return v;
  }
  loggerPath(env) {
    this.#validateEnv(env);
    const l = this.#defined(this.#config.logger, "logger not defined");
    return this.#defined(l[env]?.path, `logger.${env}.path not defined`);
  }

  loggerUrl(env) {
    this.#validateEnv(env);
    const l = this.#defined(this.#config?.logger, "logger not defined");
    const e = this.#defined(l[env], `logger.${env} not defined `);
    return `${e.host}${e.port ? ":" + e.port : ""}${e.path}`;
  }

  loggerEnabled(env) {
    this.#validateEnv(env);
    const l = this.#defined(this.#config?.logger, "logger not defined");
    return this.#defined(l[env]?.enabled, `logger.${env}.enabled not defined`); // is defaulted via Joi
  }
}

module.exports = Config;
