# hexo-csp

[![GitHub issues](https://img.shields.io/github/issues/xbc5/hexo-csp.svg)](https://github.com/xbc5/hexo-csp/issues)

CSP policy generator for [Hexo](https://hexo.io/). Generate an inline policy, and automatically hash inline elements.

## Installation
TODO

## Configuration
Add the following snippet in `_config.yml`.

NOTES:
- the set Hexo configuration for permalinks (e.g. `trailing_index` and `trailing_html` affect what you should use for policy keys (which are page paths) -- *except in the case for your root index.html*, which is always "index.html";

```yaml
csp:
  enabled: true
  integrity:
    enabled: true
    algo: sha256
  priority: 100
  violation:
    action:
      - warn
      - throw
  mode:
    env: merge # | replace
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
      foo/index.html:
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
      foo/index.html:
        mode: replace
        directives:
          default-src:
            - 'self'
          img-src:
            - 'self'
```
