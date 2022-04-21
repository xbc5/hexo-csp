"use strict";

const { buildPolicies } = require("./util");

class Config {
  #config;
  #policies;

  constructor(config = {}) {
    // enabled defaults to false, so if this defaults, then enabled: false.
    this.#config = config.csp || {};
    if (this.#config?.env === undefined) {
      this.#config.env = "prod"; //set by CLI, this is for tests
    }

    const policies = this.#getInitialPolicies();
    this.#policies = buildPolicies(...policies);
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
    const dev = this.#config?.dev?.policies;
    const prod = this.#config?.prod?.policies;

    const policies = [];
    if (prod) policies.push(prod);
    if (this.isDev && dev) policies.push(dev);

    return policies;
  }

  addPolicies(...policies) {
    // TODO: validate args
    if (policies.length === 0) return this;
    this.#policies = buildPolicies(this.#policies, ...policies);
    return this;
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
   *   [path]: {
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
    return this.#policies[path] || {};
  }

  directives(path) {
    return this.#policies[path]?.directives || {};
  }
}

module.exports = Config;
