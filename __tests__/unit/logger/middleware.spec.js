const {
  middleware: factory,
  format: formatLog,
} = require("../../../lib/logger");
const clone = require("lodash.clonedeep");

const fixture = (req) => {
  const logger = jest.fn();
  const res = { end: jest.fn() };
  return { args: [clone(req), res], middleware: factory(logger), logger, res };
};

const req = () => ({
  body: { foo: "bar" },
});

describe("log()", () => {
  it("should be called with the request body", async () => {
    const { middleware, logger, args } = fixture(req());
    middleware(...args);
    expect(logger).toHaveBeenCalledWith(formatLog(req().body));
  });

  it("should be called only once", async () => {
    const { middleware, logger, args } = fixture(req());
    middleware(...args);
    expect(logger).toHaveBeenCalledTimes(1);
  });
});

describe("res.end()", () => {
  it("should be called only once", async () => {
    const { middleware, args, res } = fixture(req());
    middleware(...args);
    expect(res.end).toHaveBeenCalledTimes(1);
  });
});
