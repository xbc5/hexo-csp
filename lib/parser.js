"use strict";

const cheerio = require("cheerio");

function inject(markup, ...meta) {
  const $ = cheerio.load(markup); // BUG: setting doc to false causes only title in result
  $("head").prepend(...meta);
  return $.root().html();
}

module.exports = { inject };
