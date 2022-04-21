"use strict";

const { setPolicyDefaults } = require("../../lib/util");

describe("mode", () => {
  it("should keep the value provided", async () => {
    const p = { mode: "replace" };
    expect(setPolicyDefaults(p)).toMatchObject(p);
  });
  it('should default to "merge"', async () => {
    expect(setPolicyDefaults({})).toMatchObject({ mode: "merge" });
  });
});

describe("directives", () => {
  it("should keep the value provided", async () => {
    const p = { directives: { "default-src": "'self'" } };
    expect(setPolicyDefaults(p)).toMatchObject(p);
  });
  it('should default to "{}"', async () => {
    expect(setPolicyDefaults({})).toMatchObject({ directives: {} });
  });
});
