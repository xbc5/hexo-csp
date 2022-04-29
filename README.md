# hexo-csp

[![GitHub issues](https://img.shields.io/github/issues/xbc5/hexo-csp.svg)](https://github.com/xbc5/hexo-csp/issues)

CSP policy generator for [Hexo](https://hexo.io/). Generate an inline policy, and automatically hash inline elements.

## Installation
TODO

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
  integrity:
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
