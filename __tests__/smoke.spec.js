"use strict";

const { fixture } = require("./helpers/mock");

describe("using the hexo-test-utils", () => {
  it("should return a rendered document", async () => {
    const render = await fixture("default");
    expect(await render("fake.html")).toMatchSnapshot();
  });

  describe("the markdown fixture", () => {
    ["markdown-1", "markdown-2", "/"].forEach((name) => {
      it(`should return a rendered page for ${name}`, async () => {
        const render = await fixture("markdown");
        expect(await render(name)).toMatchSnapshot();
      });
    });
  });
});
