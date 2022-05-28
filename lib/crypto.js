const forge = require("node-forge");

class Hash {
  #subject;

  constructor(subject, algo = "sha256") {
    if (!["sha256", "sha384", "sha512"].includes(algo)) {
      throw Error(`Unsupported hash algorithm: "${algo}".`);
    }
    this.#subject = forge.md[algo].create().update(subject);
  }

  digest() {
    return this.#subject.digest();
  }

  base64() {
    return forge.util.encode64(this.digest().data).toString();
  }

  generate() {
    return this.base64();
  }
}

module.exports = { Hash };
