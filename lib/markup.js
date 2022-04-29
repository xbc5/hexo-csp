"use strict";

const { inject } = require("./parser");
const Directives = require("./Directives");
const { stripIndex } = require("./util");

function metaTag(content) {
  return `<meta http-equiv="Content-Security-Policy" content="${content}">`;
}

// FIXME: refactor this. inject only markup and policies. returning { result, error }
// DON'T validate the markup here, create  separate function and use a pipeline
function applyCSP(config, page, markup, error = () => false) {
  // use slug, so we don't have to match rules against permalink paths,
  // but focus on the document itself. Fallback to page.path because pages
  // don't use slugs.
  let path = stripIndex(page.page?.slug || page.path);
  if (!path) throw Error(`Undefined path, cannot apply CSP to '${path}'.`);

  if (page?.page?.csp) {
    const frontmatter = { [path]: page.page.csp };
    const errors = config.addPolicies(frontmatter); // one policy; one error max
    if (error(errors[0])) markup; // so [0]
  }

  const directives = config.directives(path);
  if (Object.keys(directives).length === 0) return markup;

  const meta = metaTag(Directives.toString(directives));
  return inject(markup, meta);
}

module.exports = { metaTag, applyCSP };
