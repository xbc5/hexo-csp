function meta(strings, tag, version) {
  return tag
    ? strings[0] + `\n    ${tag}` + strings[1] + version + strings[2]
    : strings[0] + strings[1] + version + strings[2];
}

function template(ctx, metaTag) {
  return meta`
<!DOCTYPE html>
<html lang="en">
  <head>${metaTag}
    <title>Fake Title: Basic</title>
  <meta name="generator" content="Hexo ${ctx.env.version}"></head>
  <body>
    <h1>Fake Heading: Basic</h1>
  </body>
</html>
`.trim();
}

module.exports = template;
