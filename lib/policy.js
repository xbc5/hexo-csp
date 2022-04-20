class Policy {
  #data;
  #directives;
  #path;

  constructor(path, data = {}, notDirectives = ["mode"]) {
    // TODO: validate: url; directive keys; modes; source values is array;
    // TODO: validate uniqueness of directives, warn on duplicates
    this.#data = data;
    this.#path = path;
    this.#directives = this.#filter(this.#data, notDirectives);
  }

  #filter(data, filtered) {
    // Remove filtered; ensure only directives.
    return Object.fromEntries(
      Object.entries(data).filter(([k]) => !filtered.includes(k))
    );
  }

  get path() {
    return this.#path;
  }

  get mode() {
    return this.#data.mode || "merge";
  }

  get directives() {
    return this.#directives || {};
  }
}

module.exports = Policy;
