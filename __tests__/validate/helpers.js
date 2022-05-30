const validConfig = () => ({
  enabled: true,
  inline: {
    enabled: true,
    algo: "sha512",
  },
  logger: {
    prod: {
      enabled: false,
      host: "https://prod-logger.com",
      path: "/custom-prod-csp-logger",
    },
    dev: {
      enabled: true,
      host: "https://dev-logger.com",
      port: "4001",
      path: "/custom-dev-csp-logger",
    },
  },
  priority: 100,
  policies: [
    {
      pattern: "^foo$",
      prod: {
        mode: "replace",
        directives: {
          "default-src": ["https://foo.com", "https://bar.com"],
          "img-src": ["https://foo.com", "https://bar.com"],
        },
      },
      dev: {
        directives: {
          "default-src": ["https://bar.com"],
        },
      },
    },
    {
      pattern: "^bar$",
      prod: {
        mode: "merge",
        directives: {
          "img-src": ["https://foo.com"],
        },
      },
      dev: {
        mode: "merge",
        directives: {
          "img-src": ["https://foo.com"],
        },
      },
    },
  ],
});

module.exports = { validConfig };
