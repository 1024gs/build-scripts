const utils = require("../scripts/utils.js");
jest
  .spyOn(utils, "source")
  .mockImplementation(() => () => "scripts-tests/utils-test-mock/foo.scss");

const fs = require("fs");
jest.spyOn(fs, "writeFileSync");
fs.writeFileSync.mockImplementation(jest.fn());

const { buildBootstrap } = require("../scripts/tasks.js");

describe("buildBootstrap()", () => {
  it("builds bootstrap (scss)", async () => {
    await buildBootstrap();

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync.mock.calls[0][0]).toBe(
      `vendors/bootstrap/dist/css/bootstrap.css`,
    );
    expect(fs.writeFileSync.mock.calls[0][1]).toBe("p {\n  color: red;\n}");
  });
});
