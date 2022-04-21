"use strict";

function meta(strings, tag, version) {
  const result = tag
    ? [strings[0], `\n    ${tag}`, strings[1], version, strings[2]]
    : [strings[0], strings[1], version, strings[2]];

  return result.filter((item) => item).join("");
}

function basic(metaTag) {
  return meta`
<!DOCTYPE html>
<html lang="en">
  <head>${metaTag}
    <title>Fake Title</title>
  </head>
  <body></body>
</html>
`.trim();
}

const noMeta = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Fake Title</title>
  </head>
  <body></body>
</html>
`.trim();

module.exports = { basic, noMeta };
