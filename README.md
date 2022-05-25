# hexo-csp

[![GitHub issues](https://img.shields.io/github/issues/xbc5/hexo-csp.svg)](https://github.com/xbc5/hexo-csp/issues)

CSP policy generator for [Hexo](https://hexo.io/). Generate an inline policy, and automatically hash inline elements.

## Installation
TODO

## Caveats
Some CDNs will minify your documents/assets (e.g. [Cloudflare](https://support.cloudflare.com/hc/en-us/articles/200168196-Using-Cloudflare-Auto-Minify)). This will break inline code like styles and scripts. You must disable this for HTML documents if you intend to use the `inline` option. This option will hash the contents of these tags, and it must be done AFTER minifying. So, if you intend to minify your HTML, then do this as a build step BEFORE calculating the checksums for inline code.

## Configuration
Add the following snippet in `_config.yml`.

NOTES:
- paths are regular expression -- one policy can match multiple paths;
- don't match policies against `/index.html` -- it's ignored:
  - use `/` to match against the root document;
  - use `^foo$` to match against `foo/index.html`;
- don't match against permalinks (e.g. `2020/02/02/foo`), just match it against the document name (e.g. `foo`);

```yaml
csp:
  enabled: true
  priority: 100
  inline:
    enabled: true
    algo: sha256
  logger:
    prod:
      enabled: false
    dev:
      enabled: true
      host: localhost
      port: 4000
      path: /csp-logger
  policies:
    - pattern: ^bar$
      prod:
        directives:
          default-src:
            - 'self'
          img-src:
            - 'self'
      dev:
        mode: replace
        directives:
          default-src:
            - https://foo.com
    - pattern: ^/$
      prod:
        directives:
          default-src:
            - https://example.com
```
