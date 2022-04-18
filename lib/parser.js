const cheerio = require("cheerio");

function inject(data, ...meta) {
  const $ = cheerio.load(data); // BUG: setting doc to false causes only title in result
  $("head").prepend(...meta);
  return $.root().html();
}

module.exports = { inject };
