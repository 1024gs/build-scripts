const utils = require("../scripts/utils.js");
jest
  .spyOn(utils, "source")
  .mockImplementation(() => () => "scripts-tests/utils-test-mock/foo.scss");

const fs = require("fs");
jest.spyOn(fs, "writeFile").mockImplementation((a, b, c, callback) => {
  callback();
});

const { buildBootstrap } = require("../scripts/tasks.js");

describe("buildBootstrap()", () => {
  it("builds bootstrap (scss)", async () => {
    await buildBootstrap();

    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(fs.writeFile.mock.calls[0][0]).toBe(
      `vendors/bootstrap/dist/css/bootstrap.css`,
    );
    expect(fs.writeFile.mock.calls[0][1]).toBe("p {\n  color: red;\n}");
  });
});
