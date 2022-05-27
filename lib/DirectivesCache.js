const clone = require("lodash.clonedeep");

// TODO: test me
class DirectivesCache {
  #file;
  #toWrite = {};
  #toRead;
  #log;

  constructor(file, log = { warn: console.warn }) {
    this.#file = file;
    this.#log = log;
  }

  get directives() {
    if (this.#toRead === undefined) this.read();
    return clone(this.#toRead);
  }

  read() {
    this.#toRead = JSON.parse(this.#file.read());
    return clone(this.#toRead);
  }

  add(
    key,
    { base, path, canonical_path, slug, permalink, full_source, directives }
  ) {
    if (Object.keys(directives).length === 0 || directives === undefined) {
      return this; // nothing to write
    }
    if (this.#toWrite[key] === undefined) {
      this.#toWrite[key] = {
        // there's some nested objects, so clone
        base,
        path,
        canonical_path,
        slug,
        permalink,
        full_source,
        directives: clone(directives),
      };
      return this;
    }
    // you probably will only do this once for each path.
    throw Error(`Directives for "${key}" already exists in the cache.`);
  }

  write() {
    if (Object.keys(this.#toWrite).length === 0) {
      this.#log.warn("Cache to write is empty. Writing empty object.");
    }
    this.#file.write(JSON.stringify(this.#toWrite, undefined, 2));
    this.#toRead = clone(this.#toWrite); // since file writing was successful
    return this;
  }
}

module.exports = DirectivesCache;
