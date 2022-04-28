"use strict";
const { fixture, render } = require("./helpers/mock");

describe("given an invalid config", () => {
  it("should not render a CSP", async () => {
    const render = await fixture("invalid-config");
    await expect(await render("/")).toMatchSnapshot();
  });
});
