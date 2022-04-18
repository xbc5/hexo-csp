const template = require("./helpers/template");
const { inject } = require("../lib/parser");

describe("for inject(html, metaTag)", () => {
  it("it should inject the meta tag into the head element", async () => {
    const before = template.basic();
    const meta = '<meta http-equiv="" content="">';

    expect(inject(before, meta)).toMatchSnapshot();
  });

  it("it should inject multiple meta tags", async () => {
    const before = template.basic();
    const meta = '<meta http-equiv="" content="">';

    expect(inject(before, meta, meta)).toMatchSnapshot();
  });
});
