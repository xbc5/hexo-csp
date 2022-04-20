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
function mergePolicies(...directives) {
  const keys = keyUnion(...directives);

  const result = {};
  keys.forEach((k) => {
    const sources = [];
    directives.forEach((d) => defined(d) && sources.push(d[k]));
    result[k] = mergeArrays(...sources);
  });
  return result;
}

module.exports = { mergeArrays, keyUnion, mergePolicies, defined };
