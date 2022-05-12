"use strict";

const cheerio = require("cheerio");
const { Hash } = require("./crypto");
const Directives = require("./Directives");
const { stripIndex } = require("./util");

class Markup {
  #$;
  #ctx;
  #hash;
  #getCspStr;

  constructor(
    markupStr,
    generateHash = () => null,
    generateCspStr = () => null
  ) {
    this.#$ = cheerio.load(markupStr); // BUG: setting doc to false causes only title in result
    this.#ctx = this.#$;
    this.#hash = generateHash;
    this.#getCspStr = generateCspStr;
  }

  get scripts() {
    this.#ctx = this.#$("script");
    return this;
  }

  get styles() {
    this.#ctx = this.#$("style");
    return this;
  }

  get defined() {
    const that = this;
    this.#ctx = this.#ctx.filter(function () {
      const content = that.#$(this).html();
      return !/^[\n\t ]*?$/.test(content); // use lazy matching, don't parse entire source
    });
    return this;
  }

  get hashes() {
    const hashes = [];
    const that = this;
    this.#ctx.each(function () {
      hashes.push(that.#hash(that.#$(this).html()));
    });
    return hashes;
  }

  metaTag(content) {
    return `<meta http-equiv="Content-Security-Policy" content="${content}">`;
  }

  inject(...meta) {
    this.#$("head").prepend(...meta);
    return this;
  }

  toString() {
    return this.#$.root().html();
  }

  generate() {
    const scriptHashes = this.scripts.hashes;
    const styleHashes = this.styles.hashes;
    const content = this.#getCspStr(scriptHashes, styleHashes);
    if (content === null) return null;
    const meta = this.metaTag(content);
    return this.inject(meta).toString();
  }
}

// FIXME: refactor this. inject only markup and policies. returning { result, error }
// DON'T validate the markup here, create  separate function and use a pipeline
function applyCSP(config, page, markup, error = () => false) {
  // use slug, so we don't have to match rules against permalink paths,
  // but focus on the document itself. Fallback to page.path because pages
  // don't use slugs.
  let realPath = stripIndex(page.page?.slug || page.path);
  if (!realPath) {
    throw Error(`Undefined path, cannot apply CSP to '${realPath}'.`);
  }

  if (page?.page?.csp) {
    const frontmatter = { [realPath]: page.page.csp }; // TODO(#24): pattern
    const errors = config.addPolicies(frontmatter); // one policy; one error max
    if (error(errors[0])) markup; // so [0]
  }

  const generateHash = (subject) => new Hash(subject, config.algo).generate();

  // NOTE: since this generates the final meta tag content, ensure that all policies
  // are final before this point.
  const generateCspStr = (scriptHashes = [], styleHashes = []) => {
    if (config.inline) {
      // merge these, replacing would mean destroying custom policies
      const policy = { [realPath]: { mode: "merge", directives: {} } }; // TODO(#24): pattern

      if (scriptHashes.length > 0) {
        // TODO(#24): pattern
        policy[realPath].directives["script-src"] = scriptHashes.map(
          (h) => `'${config.algo}-${h}'`
        );
      }
      if (styleHashes.length > 0) {
        // TODO(#24): pattern
        policy[realPath].directives["style-src"] = styleHashes.map(
          (h) => `'${config.algo}-${h}'`
        );
      }

      config.addPolicies(policy);
    }

    // NOTE(#24): don't touch this, pass in path string, to be matched
    const directives = config.directives(realPath);
    if (Object.keys(directives).length === 0) return null;

    return Directives.toString(directives);
  };

  const result = new Markup(markup, generateHash, generateCspStr).generate();
  return result === null ? markup : result;
}

module.exports = { applyCSP, Markup };
