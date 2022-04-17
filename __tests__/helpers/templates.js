function default_(metaTag = "") {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Fake Title: Basic</title>
  <meta name="generator" content="Hexo 6.1.0"></head>
  <body>
    <h1>Fake Heading: Basic</h1>
  </body>
</html>
`.trim();
}

function basic() {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Fake Title: Basic</title>
  <meta name="generator" content="Hexo 6.1.0"></head>
  <body>
    <h1>Fake Heading: Basic</h1>
  </body>
</html>
`.trim();
}

module.exports = { basic, default_ };
