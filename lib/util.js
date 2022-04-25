"use strict";

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

module.exports = {
  mergeArrays,
  keyUnion,
  defined,
};
