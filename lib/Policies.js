"use strict";

const Directives = require("./Directives");
const DefaultPolicy = require("./DefaultPolicy");
const { keyUnion, defined } = require("./util");
const clone = require("lodash.clonedeep");

class Policies {
  /*
   * Merge/replace, and set default values for the given policies.
   * Use this every time you include new policies. Typically you'd
   * pass in the policies for different environments (e.g. prod, dev),
   * this will look like [prod, dev] => [{ 'foo/index.html': { default: {} }}, ...].
   * i.e., the argumen isn't an array of policies, but an array of policies
   * from each environment. This might cause some confusion.
   *
   * @param {Array} ...envPolicies - an array of policies -- example:
   * [{ default: { mode: 'merge', directives: {} }}]
   *
   * @example
   * Policies.build({ directives: {} }, { mode: 'replace', directives: {} })
   */
  static build(...envPolicies) {
    const result = {};
    if (envPolicies.length === 0) return result;
    const filtered = envPolicies.filter(defined);
    const cloned = clone(filtered);

    const withDefaults = DefaultPolicy.fromEnvs(cloned);
    const paths = keyUnion(...withDefaults);

    paths.forEach((path) => {
      // withDefaults is keyed by path: [{ path: {/*policy*/} }];
      // so get only policies for the given path: [{/*policy*/}]
      const filtered = withDefaults
        .filter((envPolicy) => defined(envPolicy[path]))
        .map((envPolicy) => envPolicy[path]);

      const reduced = this.reduce(...filtered); // this accepts [{/*policy*/}]

      if (result[path] !== undefined) {
        throw Error(
          "Attempting to overwrite a local policy result: " +
            `this is a newly created object, it shouldn't have ${path} yet. ` +
            `It's probably a duplicate path, but this will cause data loss.`
        );
      }
      result[path] = reduced;
    });

    return result;
  }

  static clean(policy) {
    const cloned = clone(policy);
    delete cloned.mode;
    return cloned;
  }

  /**
   * Given a list of policies, reduce all directives into a single policy.
   * Typically you will reduce prod, dev, and frontmatter policies.
   * It does this by staring with the end argument, and working back
   * to the first argument, successively collapsing each policy on top
   * of the previous. The action taken is defined by the "mode" property
   * in the policy -- which is merge|replace.
   *
   * In short, given a,b,c => c > b > a. The mode of c defines how it applies
   * to b, and so on.
   */
  static reduce(...policies) {
    if (policies.length === 0) return {};

    const reversed = policies.filter(defined).reverse();

    // reduce initialValue is weird
    if (reversed.length === 0) return {};
    if (reversed.length === 1) return this.clean(reversed[0]);

    const result = reversed.reduce((prev, curr) => {
      if (prev.mode === "replace") return prev;

      return {
        mode: curr.mode,
        directives: Directives.merge(curr.directives, prev.directives),
      };
    });

    // only policies waiting to be reduced need a mode; a reduced policy is the subject
    // and has no say in what happens to it.
    return this.clean(result);
  }
}

module.exports = Policies;
