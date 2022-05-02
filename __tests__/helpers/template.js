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

const multiScripts = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Fake Title</title>
    <script>const a = null;</script>
  </head>
  <body>
    <script>const b = null;</script>
  </body>
</html>
`.trim();

const scriptNewLines = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Fake Title</title>
    <script>
      const a = null;
    </script>
  </head>
  <body>
  </body>
</html>
`.trim();

const scriptEmpty = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Fake Title</title>
    <script>
    </script>
    <script></script>
    <script> </script>
    <script>      </script>
    <script>const notEmpty = true;</script>
    <script>
      const notEmpty = true;
    </script>
  </head>
  <body>
  </body>
</html>
`.trim();

const multiStyles = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Fake Title</title>
    <style>div {}</style>
  </head>
  <body>
    <style>p {}</style>
  </body>
</html>
`.trim();

const styleNewLines = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Fake Title</title>
    <style>
      div {
        css: sucks;
      }
    </style>
  </head>
  <body>
  </body>
</html>
`.trim();

const mixedStyleScripts = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Fake Title</title>
    <script>const a=1;</script>
    <style>
      div {
        css: sucks;
      }
    </style>
  </head>
  <body>
    <script>const b=1;</script>
    <style>
      div {
        css: is-bad;
      }
    </style>
  </body>
</html>
`.trim();

// WARN: DO NOT MODIFY THIS STRING
// It's used in tests that compute the hashes of style and script tags.
// if you modify this, snapshot tests will fail, and you will have to manually
// recalculate the hash of each tag content, base64 it, then compare it to the
// snapshot -- by hand. Not fun, Don't do it.
//
// NOTE: the above mixedStyleScripts is identical to this, except it's safer to modify.
//
// prettier-ignore-start
const mixedStyleScriptsForHashing = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Fake Title</title>
    <script>const a=1;</script>
    <style>
      div {
        css: sucks;
      }
    </style>
  </head>
  <body>
    <script>const b=1;</script>
    <style>
      div {
        css: is-bad;
      }
    </style>
  </body>
</html>
`.trim();
// prettier-ignore-end

module.exports = {
  basic,
  noMeta,
  multiScripts,
  scriptNewLines,
  multiStyles,
  styleNewLines,
  scriptEmpty,
  mixedStyleScripts,
  mixedStyleScriptsForHashing,
};
