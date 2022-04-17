const getSandbox = require("./support/sandbox");
const template = require("./helpers/template");
const { process, contentFor } = require("hexo-test-utils");
const sandbox = getSandbox();

describe("using the hexo-test-utils", () => {
  it("should return a rendered document", async () => {
    const ctx = await sandbox({ fixtureName: "default" });
    await process(ctx);
    const content = await contentFor(ctx, "fake.html");

    expect(content.toString().trim()).toBe(template(ctx));
  });
});
