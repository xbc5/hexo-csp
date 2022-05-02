const forge = require("node-forge");

class Hash {
  #subject;
  #output;

  constructor(subject, algo = "sha256") {
    if (!["sha256", "sha384", "sha512"].includes(algo)) {
      throw Error(`Unsupported hash algorithm: "${algo}".`);
    }
    this.#subject = forge.md[algo].create().update(subject);
    this.#output = subject;
  }

  hash() {
    this.#output = this.#subject.digest().toHex();
    return this;
  }

  base64() {
    this.#output = forge.util.encode64(this.#output);
    return this;
  }

  toString() {
    return this.#output;
  }

  generate() {
    return this.hash().base64().toString();
  }
}

module.exports = { Hash };
