"use strict";

const Hexo = require("hexo");
const path = require("path");
const {
  createSandbox,
  process: _process,
  contentFor,
} = require("hexo-test-utils");

function getSandbox() {
  return createSandbox(Hexo, {
    fixture_folder: path.join(__dirname, "..", "fixtures"),
    plugins: [
      require.resolve("hexo-renderer-pug"),
      require.resolve("hexo-renderer-markdown-it"),
      require.resolve("../../index.js"),
    ],
  });
}

const sandbox = getSandbox();

async function fixture(fixtureName) {
  const ctx = await sandbox({ fixtureName });
  await _process(ctx);
  return async (name) => (await contentFor(ctx, name)).toString().trim();
}

module.exports = { getSandbox, fixture };
