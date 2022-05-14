"use strict";

const clone = require("lodash.clonedeep");

const defined = (val) => val !== undefined && val !== null;

/**
 * You  must merge policies from different environments (prod, dev etc).
 * This accepts an array of objects, each object is a set of policies for
 * an environment. This will parse those, and set sensible defaults.
 *
 * @param {Array} ...envPolicies - an array of environment policies -- example:
 * const prod = { default: { directives: {}, mode: "merge"}, 'foo/index.html': {}}
 * const dev = { default: { directives: {}, mode: merge: {}}}
 * DefaultPolicy.fromEnvs(prod, dev);
 *
 * @returns {Array} - The same shape that you passed in, except it has
 * default values set: e.g. [{ default: {}}, 'foo/index.html': {}}, ...]
 *
 * @example
 * DefaultPolicy.fromEnvs({
 *   'foo/index.html': { directives: {} },
 *   { mode: 'replace', directives: {} },
 * })
 */
class DefaultPolicy {
  // TODO(#28): no longer needed, since envs are embedded
  static fromEnvs(envPolicies) {
    const withDefaults = [];
    envPolicies.forEach((env) => {
      Object.entries(env).forEach(([path, policy]) => {
        env[path] = this.fromPolicy(policy);
      });
      withDefaults.push(env);
    });
    return withDefaults;
  }

  /**
   * Take multiple policies, and set defaults for each of them.
   *
   * @param {Array} ...policies - an array of policies -- example:
   * [{ default: { mode: 'merge', directives: {} }, 'foo/index.html': {}}, {}]
   *
   * @example
   * DefaultPolicy.fromArray({ directives: {} }, { mode: 'replace', directives: {} })
   */
  static fromArray(...policies) {
    return policies.map((policy) => this.fromPolicy(policy));
  }

  /**
   * Set sane config values for a policy object. This is the base for all
   * behaviours in this class. All of them delegate to this.
   *
   * Defaults:
   *   mode = 'merge'
   *   directives = {}
   *
   * @returns {Object} - a policy: { mode: string, directives: Object }
   */
  static fromPolicy(policy = {}) {
    const cloned = clone(policy);
    if (!defined(cloned?.mode)) cloned.mode = "merge";
    if (!defined(cloned.directives)) cloned.directives = {};
    return cloned;
  }
}

module.exports = DefaultPolicy;
