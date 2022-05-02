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
- don't match policies against `/index.html`:
  - use `/` to match against the root document;
  - use `foo` to match against `foo/index.html`;
- don't match against permalinks (e.g. `2020/02/02/foo`), just match it against the document name (e.g. `foo`);

```yaml
csp:
  enabled: true
  inline:
    enabled: true
    algo: sha256
  priority: 100
  prod:
    report:
      uri: /foo/bar
      enabled: true
    policies:
      default:
        directives:
          default-src:
            - 'self'
          img-src:
            - 'self'
      /:
        directives:
          default-src:
            - https://example.com
      foo:
        mode: replace
        directives:
          default-src:
            - 'self'
          img-src:
            - 'self'
  dev:
    report:
      uri: /foo/bar
      enabled: true
    policies:
      default:
        directives
          default-src:
            - 'self' 
            - https//dev-server.com
          img-src: 
            - self https://some-placeholer-images.com
      foo:
        mode: replace
        directives:
          default-src:
            - 'self'
          img-src:
            - 'self'
```
