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

async function fixture(fixtureName, opts = {}) {
  const defaults = { ...{ cmd: "generate" }, ...opts };
  const ctx = await sandbox({ fixtureName });
  // test utils does not set the CMD. We use this to distinguish between running
  // server middleware and build-time code. Since these test utils focus on generation,
  // set this as default.
  ctx.env.cmd = defaults.cmd;
  await _process(ctx);
  return async (name) => (await contentFor(ctx, name)).toString().trim();
}

module.exports = { getSandbox, fixture };
