"use strict";
const { keyUnion, defined, mergeArrays } = require("./util");

class Directives {
  /**
   * Merge N number of directives.
   *
   * @param {Array} ...directives -- an array of { k: []} objects,
   * where k is a CSP directive and v is an array of CSP source values.
   *
   * @returns {Object} -- { k: [], ... } where k is a directive, and
   * its value is an array of source values.
   */
  static merge(...directives) {
    const keys = keyUnion(...directives);
    const result = {};

    keys.forEach((k) => {
      const sources = [];
      directives.forEach((d) => defined(d) && sources.push(d[k]));
      result[k] = mergeArrays(...sources);
    });

    return result;
  }

  static #quoted = new Set([
    "self",
    "none",
    "script",
    "unsafe-eval",
    "usafe-inline",
    "strict-dynamic",
    "unsafe-hashes",
  ]);

  // TODO: test me
  static needsQuotes(source) {
    return this.#quoted.has(source);
  }

  static toString(directives) {
    const strings = [];
    Object.entries(directives).forEach(([directive, sources]) => {
      const s = sources
        .map((s) => (this.needsQuotes(s) ? `'${s}'` : s))
        .join(" ");
      strings.push(`${directive} ${s}`);
    });
    return strings.join("; ").replace(/"/g, "'");
  }
}

module.exports = Directives;
