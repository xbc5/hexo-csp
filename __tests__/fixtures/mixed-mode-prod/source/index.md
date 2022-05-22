---
title: Markdown Home
date: 2022-04-19 05:30:00
csp:
  prod:
    mode: replace
    directives:
      default-src:
        - https://prod-frontmatter-home-default.com
      img-src:
        - https://prod-frontmatter-home-img.com
  dev:
    mode: replace
    directives:
      default-src:
        - https://dev-frontmatter-home-default--THIS_IS_BAD.com
      img-src:
        - https://dev-frontmatter-home-img--THIS_IS_BAD.com
---

## Home
