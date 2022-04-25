"use strict";

const { inject } = require("./parser");
const Directives = require("./Directives");

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

  const meta = metaTag(Directives.toString(directives));
  return inject(markup, meta);
}

module.exports = { metaTag, applyCSP };
