"use strict";

const Directives = require("./Directives");
const DefaultPolicy = require("./DefaultPolicy");
const { keyUnion, defined } = require("./util");
const clone = require("lodash.clonedeep");

class Policies {
  #policies;
  #env;

  /**
   * @param {Policy[]} initial? - optionally set initial policies. This
   * is really for convenience and testing. You don't need to do this, and
   * can use combinePolicy() safely without specifying this.
   */
  constructor(opts = {}) {
    const defaults = { initial: [], env: "prod", ...opts };
    this.#policies = clone(defaults.initial);

    if (!["prod", "dev"].includes(defaults.env)) {
      throw Error("Invalid env value.");
    }
    this.#env = defaults.env;
  }

  get policies() {
    return clone(this.#policies);
  }

  /**
   * Take in a policy, and combine (merge|replace) its directives found under
   * the environment keys.
   *
   * The mode set on the dev key determines how these environments combine:
   * merge: append the sources of prod with dev's;
   * replace: ignore prod's, and use devs exclusively;
   *
   * The resulting mode value reflects prod.mode. This enables a
   * cascading merge: dev => prod => other. For example, you may combine front matter
   * policies, and then in turn combine them with base config policies. This way,
   * it preserves the mode as far as it's needed, but once replace is encountered,
   * the state of the policies up to that point take precedence over all others.
   *
   * In short: use merge everywhere to simply merge all policies. Using "replace"
   * anywhere in the chain, causes all merges up to that point to be the end result.
   *
   * @param {Policy} - an object { pattern, prod: { mode, directives }, dev: ... }
   *
   * @returns {FlatPolicy} - an object { pattern, mode, directives }, where the
   * subsequent directives and modes of each environment keys are combined, and moved
   * up one level.
   *
   * @example
   * combineEnvs({ pattern, prod: { mode, directives }, dev: { mode, directives }});
   * // => { pattern, mode, directives };
   */
  combineEnvs(subject) {
    const s = clone(subject);
    const prod = s?.prod;
    const dev = s?.dev;
    const isDev = this.#env === "dev";

    if (isDev) {
      if (dev?.mode === "merge") {
        return {
          pattern: subject.pattern,
          mode: prod?.mode || "merge",
          directives: Directives.merge(prod?.directives, dev?.directives),
        };
      }

      if (dev?.mode === "replace") {
        return {
          pattern: subject.pattern,
          mode: "replace", // replace trumps all
          directives: dev.directives,
        };
      }

      if (dev) {
        throw Error(
          "Invalid dev mode, cannot combine environments. Validate policies first."
        );
      }
    }

    if (!prod) {
      throw Error(
        `No env keys for env=${this.#env}, cannot combine directives.`
      );
    }

    return {
      pattern: subject.pattern,
      mode: prod.mode,
      directives: prod.directives,
    };
  }

  combinePolicy(subject) {
    const _subject = clone(subject);

    let found = false;
    const mapped = clone(this.#policies).map((base) => {
      if (base.pattern === _subject.pattern) {
        found = true;
        const policy = {
          ...base,
          directives:
            _subject.mode === "merge"
              ? Directives.merge(base.directives, _subject.directives)
              : _subject.directives,
        };
        delete policy.mode; // these are base policies, no need for this now
        return policy;
      }

      delete base.mode;
      return base;
    });

    // pattern not found
    delete _subject.mode;
    if (!found) mapped.push(_subject);
    return mapped;
  }

  usePolicy(subject) {
    return this.combinePolicy(this.combineEnvs(subject));
  }

  savePolicy(subject, result = false) {
    this.#policies = this.usePolicy(subject);
    if (result) return this.policies; // another clone
  }

  match(path, policies) {
    const pol = policies || this.#policies; // use #policies, so it doesn't clone
    const result = pol.filter((p) => {
      return new RegExp(p.pattern).test(path);
    });
    return clone(result); // because we clone here (to clone policies arg too)
  }

  directives(path, policies) {
    const directives = this.match(path, policies).map((p) => p.directives);
    return Directives.merge(...directives);
  }
}

module.exports = Policies;
