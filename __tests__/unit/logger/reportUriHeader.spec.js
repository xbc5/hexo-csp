const { reportUriHeader: factory } = require("../../../lib/logger");

const fixture = (
  reportUrl = "https://my-logger.com",
  directives = "default-src https://directive1.com; img-src https://directive2.com"
) => {
  const setHeader = jest.fn();
  const next = jest.fn();
  const res = { setHeader };
  return {
    args: [{}, res, next],
    middleware: factory(reportUrl, directives),
    next,
    res,
  };
};

describe("when finished", () => {
  it("should call next", async () => {
    const { middleware, args, next } = fixture();
    middleware(...args);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should not call next with any args (i.e. no error)", async () => {
    const { middleware, args, next } = fixture();
    middleware(...args);
    expect(next.mock.calls[0]).toMatchSnapshot();
  });
});

describe("when setting the Content-Security-Policy header", () => {
  it("should do it only once", async () => {
    const { middleware, args, res } = fixture();
    middleware(...args);
    expect(res.setHeader).toHaveBeenCalledTimes(1);
  });

  it("should set it with expected values", async () => {
    const { middleware, args, res } = fixture();
    middleware(...args);
    expect(res.setHeader.mock.calls[0]).toMatchSnapshot();
  });
});
