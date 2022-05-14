"use strict";

const Policies = require("./Policies");
const clone = require("lodash.clonedeep");

class Config {
  #config;
  #policies;
  #validateConf;
  #validatePolicies;

  constructor(
    config = {},
    validateConf = (c) => ({ value: c }),
    validatePolicies = (p) => ({ value: p })
  ) {
    // enabled defaults to false, so if this defaults, then enabled: false.
    this.#config = config?.csp || {};
    this.#config = clone(this.#config);
    this.#validateConf = validateConf;
    this.#validatePolicies = validatePolicies;

    if (this.#config?.env === undefined) {
      this.#config.env = "prod"; //set by CLI, this is for tests
    }

    // TODO(#28): remove this, instead just get this.#config.policies
    const policies = this.#getInitialPolicies();
    this.#policies = Policies.build(...policies);
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

  #getInitialPolicies() {
    // TODO(#28): remove this, instead just get this.#config.policies
    const dev = this.#config?.dev?.policies;
    const prod = this.#config?.prod?.policies;

    const policies = [];
    if (prod) policies.push(prod);
    if (this.isDev && dev) policies.push(dev);

    return policies;
  }

  addPolicies(...policies) {
    if (policies.length === 0) return [];

    const errors = policies
      .map((p) => {
        const { error } = this.#validatePolicies(p);
        return error;
      })
      .filter((p) => p !== undefined);
    if (errors.length > 0) return errors; // array

    this.#policies = Policies.build(this.#policies, ...policies);

    return []; // be consistent
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
   * Get all policies
   *
   * @example
   * {
   *   [pathPattern]: {
   *     mode: string,
   *     directives: Array
   *   }, ...
   * }
   *
   * @type {Object}
   */
  get policies() {
    return this.#policies || {};
  }

  get algo() {
    return this.#config.inline?.algo || "sha256";
  }

  get inline() {
    return this.#config.inline?.enabled || false;
  }

  /*
   * Given a real path, search through policies and match against its
   * RegExp. It will merge multiple policies into one.
   */
  #matchPolicies(path) {
    const policies = Object.entries(this.#policies)
      .filter(([pattern]) => {
        return new RegExp(pattern).test(path);
      })
      .map((entries) => entries[1]); // where care only about the policies, not the pattern

    // if multiple policies, reduce them, else policy or null
    const dispatch = [null, policies[0], Policies.reduce(...policies)];
    return dispatch[policies.length]; // BUG: this won't handle four+ policies
  }

  /**
   * Get a policy for a given path.
   *
   * @param {string} path - the URI (without domain)
   * @returns {Object} a policy object, or an empty object if
   * not found.
   *
   * @example
   * p.policy('some-path/index.html');
   * // => { mode: string; directives: Array }
   */
  policy(path) {
    return this.#matchPolicies(path) || {};
  }

  directives(path) {
    return this.policy(path).directives || {};
  }
}

module.exports = Config;
