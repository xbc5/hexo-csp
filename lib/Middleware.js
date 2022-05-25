const { middleware: cspLogMiddleware } = require("./logger");
const bodyParser = require("body-parser");

class Middleware {
  #hexo;
  #config;
  #cspLogger;

  constructor(hexo, config, opts = {}) {
    const defaults = { ...{ cspLogMiddleware }, ...opts };

    this.#hexo = hexo;
    this.#config = config;
    this.#cspLogger = defaults.cspLogMiddleware;
  }

  #register(fn) {
    this.#hexo.extend.filter.register("server_middleware", fn);
  }

  acceptJSON() {
    this.#register(function (app) {
      app.use(bodyParser.json());
    });
    return this;
  }

  logCSP() {
    const that = this;
    const logger = this.#hexo?.log?.error.bind(this.#hexo.log) || console.error;
    this.#register(function (app) {
      // middleware only makes sense for dev env, prod will use a real, third-party server.
      app.use(that.#config.loggerPath("dev"), that.#cspLogger(logger));
    });
    return this;
  }
}

module.exports = Middleware;
