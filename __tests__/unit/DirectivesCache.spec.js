const DirectivesCache = require("../../lib/DirectivesCache");

const toAdd = (num) => ({
  base: `base${num}`,
  path: `path${num}`,
  canonical_path: `canonical_path${num}`,
  slug: `slug${num}`,
  permalink: `permalink${num}`,
  full_source: `full_source${num}`,
  directives: {
    [`directive${num}`]: [`source${num}a`, `source${num}b`],
  },
});

function fixture() {
  const log = { warn: jest.fn() };
  const file = { read: jest.fn(), write: jest.fn(), log };
  const fileData = '{ "foo": "bar" }';
  const readData = JSON.parse(fileData); // file data read, and stored in memory
  file.read.mockReturnValue(fileData);
  const cache = new DirectivesCache(file, log);
  return { cache, file, log, fileData, readData };
}

it("should call injected file.read when calling read()", async () => {
  const { cache, file } = fixture();
  cache.read();
  expect(file.read).toHaveBeenCalledTimes(1);
});

it("should populate directives without having to call read() first", async () => {
  const { cache, readData } = fixture();
  expect(cache.directives).toStrictEqual(readData);
});

describe("after adding data", () => {
  function run() {
    const { cache, file } = fixture();
    cache.add("key1", toAdd(1));
    cache.add("key2", toAdd(2));
    cache.write();
    return { cache, file };
  }

  it("should write it to file when instructed", async () => {
    const { file } = run();
    expect(file.write.mock.calls[0]).toMatchSnapshot();
  });

  it("should keep read data in sync with the written data", async () => {
    const { cache } = run();
    expect(cache.directives).toMatchSnapshot();
  });
});
