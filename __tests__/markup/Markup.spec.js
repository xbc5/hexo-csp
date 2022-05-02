"use strict";

const { Markup } = require("../../lib/markup");
const {
  basic,
  noMeta,
  multiScripts,
  scriptNewLines,
  multiStyles,
  styleNewLines,
  scriptEmpty,
  mixedStyleScripts,
} = require("../helpers/template");

describe("when fetching script hashes and given a hash generator", () => {
  it("should inject script contents into the generator, and return results as an array", async () => {
    const markup = new Markup(multiScripts, (s) => s);
    const expected = ["const a = null;", "const b = null;"];
    expect(markup.scripts.hashes).toStrictEqual(expected);
  });

  it("should include new lines and whitespace", async () => {
    const markup = new Markup(scriptNewLines, (s) => s);
    expect(markup.scripts.hashes).toMatchSnapshot();
  });
});

describe("when fetching style hashes and given a hash generator", () => {
  it("should inject style contents into the generator, and return results as an array", async () => {
    const markup = new Markup(multiStyles, (s) => s);
    const expected = ["div {}", "p {}"];
    expect(markup.styles.hashes).toStrictEqual(expected);
  });

  it("should include new lines and whitespace", async () => {
    const markup = new Markup(styleNewLines, (s) => s);
    expect(markup.styles.hashes).toMatchSnapshot();
  });
});

describe("when fetching defined nodes", () => {
  it("it should only select those that have real content (not exclusively \\n \\t <space>)", async () => {
    const markup = new Markup(scriptEmpty, (s) => s);
    expect(markup.scripts.defined.hashes).toMatchSnapshot();
  });
});

describe("metaTag()", () => {
  it("should include the given data within a meta tags contents", async () => {
    const expected =
      `<meta http-equiv="Content-Security-Policy" ` +
      `content="default-src 'self'; img-src https://foo.com">`;

    const result = new Markup(noMeta).metaTag(
      "default-src 'self'; img-src https://foo.com"
    );

    expect(result).toBe(expected);
  });
});

describe("inject()", () => {
  const meta = `<meta http-equiv="Content-Security-Policy" content="default-src: 'self'">`;

  it("it should inject the given meta tag into the head element", async () => {
    const before = basic();
    const markup = new Markup(before);
    expect(markup.inject(meta).toString()).toMatchSnapshot();
  });

  it("it should inject multiple meta tags", async () => {
    const before = basic();
    const markup = new Markup(before);
    expect(markup.inject(meta, meta).toString()).toMatchSnapshot();
  });
});

describe("generate()", () => {
  const markup = () => {
    const generateHash = () => "{{hash}}";
    const generateCspStr = (scriptHashes, styleHashes) => {
      return Array.prototype.concat(scriptHashes, styleHashes).join("; ");
    };
    return new Markup(mixedStyleScripts, generateHash, generateCspStr);
  };

  it("should include 4x {{hash}}, one for each script and style tags", async () => {
    const m = markup().generate();
    expect(m).toMatchSnapshot();
  });
});
