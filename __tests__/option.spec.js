const getSandbox = require("./support/sandbox");
const { process, mockConfig, contentFor } = require("hexo-test-utils");
const sandbox = getSandbox();

async function runTest(options, metaTag) {
  const ctx = await sandbox({ fixtureName: "default" });
  mockConfig(ctx, "csp", options);
  await process(ctx);
  const content = await contentFor(ctx, "fake.html");
  expect(content.toString().trim()).toMatchSnapshot();
}

describe("when enabled:false", () => {
  it("should render the content without modification", async () => {
    await runTest({ enabled: false });
  });
});

describe("when enabled:true", () => {
  it("should render the content with modifications", async () => {
    const meta = '<meta http-equiv="" content="">';
    await runTest({ enabled: true }, meta);
  });
});
