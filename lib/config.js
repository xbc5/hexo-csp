"use strict";

const Policies = require("./Policies");
const clone = require("lodash.clonedeep");

class Config {
  #config;
  #policies;
  #validateConf;

  constructor(config = {}, validateConf = (c) => ({ value: c })) {
    // enabled defaults to false, so if this defaults, then enabled: false.
    this.#config = config?.csp || {};
    this.#config = clone(this.#config);
    this.#validateConf = validateConf;

    if (this.#config?.env === undefined) {
      this.#config.env = "prod";
    }

    this.#policies = this.#config.policies;
  }

  validate() {
    const result = this.#validateConf(this.#config);
    return result?.error;
  }

  /* Check if a production environment is set. Is true ONLY IF it's NOT a dev
   * environment. This means that production is the default if an explicit
   * dev environment is not used.
   *
   * @type {boolean}
   *
   */
  get isProd() {
    return !this.isDev;
  }

  /* Check if a development environment is set. Define these in conf.csp.dev.env
   * as a list. If these are not specified, the defaults are dev, develop, development,
   * test, trace, and debug.
   *
   * @type {boolean}
   *
   */
  get isDev() {
    return this.#config.env === "dev";
  }

  get env() {
    return this.#config.env;
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
}

module.exports = Config;
