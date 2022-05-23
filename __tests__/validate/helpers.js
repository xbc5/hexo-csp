const validConfig = () => ({
  enabled: true,
  inline: {
    enabled: true,
    algo: "sha512",
  },
  logger: {
    prod: {
      enabled: false,
      uri: "https://prod-logger.com",
    },
    dev: {
      enabled: true,
      uri: "https://dev-logger.com",
    },
  },
  priority: 100,
  env: "prod",
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
