const { middleware: cspLogMiddleware, reportUriHeader } = require("./logger");
const bodyParser = require("body-parser");

class Middleware {
  #hexo;
  #config;
  #cspLogger;
  #reportUriHeader;

  constructor(hexo, config, opts = {}) {
    const defaults = { ...{ cspLogMiddleware, reportUriHeader }, ...opts };

    this.#hexo = hexo;
    this.#config = config;
    this.#cspLogger = defaults.cspLogMiddleware;
    this.#reportUriHeader = defaults.reportUriHeader;
  }

  #register(fn) {
    this.#hexo.extend.filter.register("server_middleware", fn);
  }

  /**
   * Set the appropriate response headers to do CSP violation logging.
   *
   * @param {String} path - the current document being rendered/processed. This binds the
   * middlware to that path, such that responses for that path serve the directives provided.
   *
   * @param {String} directives - in the form of: "default-src foo; img-src bar" (without a
   * trailing slash. This is easily possible with directives.join("; "), where directives is
   * an array.
   *
   * @returns {this} - the current instance; enables builder pattern.
   *
   * @example m.setReportUri('/foo/bar', "default-src foo; img-src bar")
   */
  setReportUri(path, directives) {
    // TODO: test me
    const _path = path[0] === "/" ? path : `/${path}`;
    const that = this;
    this.#register(function (app) {
      const reportUrl = that.#config.loggerUrl("dev");
      app.use(_path, that.#reportUriHeader(reportUrl, directives));
    });
    return this;
  }

  acceptReportMIME() {
    this.#register(function (app) {
      app.use(
        bodyParser.json({
          type: [
            "application/json",
            "application/csp-report",
            "application/reports+json",
          ],
        })
      );
    });
    return this;
  }

  logCSP() {
    const that = this;
    const logger = this.#hexo?.log?.error.bind(this.#hexo.log) || console.error;
    this.#register(function (app) {
      // middleware only makes sense for dev env, prod will use a real, third-party server.
      app.use(
        that.#config.loggerPath("dev"),
        that.#cspLogger("CSP violation", logger)
      );
    });
    return this;
  }
}

module.exports = Middleware;
