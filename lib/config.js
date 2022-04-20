"use strict";
const Policy = require("./policy");
const { keyUnion, defined, mergePolicies } = require("./util");

class Config {
  #config;
  #policies;
  #_isDev = null; // use null; NODE_ENV has undefined/"undefined" weirdness.

  constructor(config = {}) {
    // enabled defaults to false, so if this defaults, then enabled: false.
    this.#config = config.csp || {};

    const policies = [this.#config?.prod?.policies];
    if (this.isDev) policies.push(this.#config?.dev?.policies);

    this.#policies = this.#buildPolicies(...policies);
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
    if (this.#_isDev === null) {
      const env = this.#config?.dev?.env || [
        "dev",
        "develop",
        "development",
        "test",
        "trace",
        "debug",
      ];
      this.#_isDev = env.includes(process.env["NODE_ENV"]);
    }
    return this.#_isDev;
  }

  #buildPolicies(...policies) {
    const paths = keyUnion(...policies);
    const result = {};
    paths.forEach((path) => {
      const directives = [];
      policies.forEach(
        (policy) =>
          defined(policy) &&
          defined(policy[path]) &&
          directives.push(policy[path])
      );
      const merged = mergePolicies(...directives);
      result[path] = new Policy(path, merged);
    });
    return result;
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
   * Get all policies: { path: Policy, ... }.
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
   * @returns {Policy} a policy object.
   */
  policy(path) {
    return this.#policies[path] || {};
  }
}

module.exports = Config;
