const DirectivesCache = require("./DirectivesCache");
const File = require("./File");
const path = require("path");

module.exports = function () {
  return new DirectivesCache(
    new File(path.join(process.cwd(), ".directives-cache.json"))
  );
};
