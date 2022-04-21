"use strict";

const clone = require("lodash.clonedeep");
const { inject } = require("./parser");

function mergeArrays(...sources) {
  const joined = sources.reduce((prev, curr) => {
    return (prev || []).concat(curr || []);
  });
  return Array.from(new Set(joined));
}

function keys(ctx) {
  return Array.isArray(ctx) ? ctx : Object.keys(ctx);
}

/**
 * Given a set of object, return a union of their keys.
 *
 * @example keyUnion({a: 1}, {a: 1, b: 2}); // => Set({'a', 'b'})
 *
 * @param {Array} objs -- N number of objects.
 *
 * @returns {Set} a union of all keys.
 */
function keyUnion(...objs) {
  if (objs.length === 0) return new Set([]);
  // reduce doesn't execute callback for arr length 1
  if (objs.length === 1) return new Set(Object.keys(objs[0] || []));

  const joined = objs.reduce((prev, curr) => {
    return keys(prev || []).concat(keys(curr || []));
  });

  return new Set(joined);
}

const defined = (val) => val !== undefined && val !== null;

/**
 * Given N number of policies, merge their directives.
 *
 * @param {Array} ...directives -- an array of { k: []} objects,
 * where k is a CSP directive and v is an array of CSP source values.
 *
 * @returns {Object} -- { k: [], ... } where k is a directive, and
 * its value is an array of source values.
 */
function mergeDirectives(...directives) {
  const keys = keyUnion(...directives);

  const result = {};
  keys.forEach((k) => {
    const sources = [];
    directives.forEach((d) => defined(d) && sources.push(d[k]));
    result[k] = mergeArrays(...sources);
  });
  return result;
}

function setPolicyDefaults(policy = {}) {
  const cloned = clone(policy);
  if (!defined(cloned?.mode)) cloned.mode = "merge";
  if (!defined(cloned.directives)) cloned.directives = {};
  return cloned;
}

function buildPolicies(...policies) {
  const result = {};
  if (policies.length === 0) return result;

  const paths = keyUnion(...policies);

  paths.forEach((path) => {
    const directives = [];
    policies.forEach(
      (policy) =>
        defined(policy) &&
        defined(policy[path]) &&
        directives.push(policy[path].directives)
    );
    const merged = mergeDirectives(...directives);

    if (result[path] !== undefined) {
      throw Error(
        "Attempting to overwrite a local policy result: " +
          `this is a newly created object, it shouldn't have ${path} yet. ` +
          `It's probably a duplicate path, but this will cause data loss.`
      );
    }
    result[path] = setPolicyDefaults({ directives: merged });
  });

  return result;
}

function directivesToString(directives) {
  const strings = [];
  Object.entries(directives).forEach(([directive, sources]) => {
    const s = sources
      .map((s) => (s === "self" || s === "none" ? `'${s}'` : s))
      .join(" ");
    strings.push(`${directive} ${s}`);
  });
  return strings.join("; ").replace(/"/g, "'");
}

function metaTag(content) {
  return `<meta http-equiv="Content-Security-Policy" content="${content}">`;
}

function applyCSP(config, page, markup) {
  if (page?.page?.csp) {
    const frontmatter = { [page.path]: page.page.csp };
    config.addPolicies(frontmatter);
  }

  const directives = config.directives(page.path);
  if (Object.keys(directives).length === 0) return markup;

  const meta = metaTag(directivesToString(directives));
  return inject(markup, meta);
}

module.exports = {
  mergeArrays,
  keyUnion,
  mergeDirectives,
  defined,
  setPolicyDefaults,
  buildPolicies,
  directivesToString,
  metaTag,
  applyCSP,
};
