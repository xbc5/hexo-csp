const fs = require("fs");

class File {
  #path;

  constructor(path) {
    this.#path = path;
  }

  read() {
    if (!fs.existsSync(this.#path)) return "";
    const data = fs.readFileSync(this.#path, { encoding: "utf8" });
    return typeof data === "string" ? data : data.toString();
  }

  write(str) {
    if (typeof str !== "string") {
      throw Error("Must provide a string to write to file.");
    }
    fs.writeFileSync(this.#path, str);
  }
}

module.exports = File;
