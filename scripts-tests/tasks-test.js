jest.mock("../scripts/utils.js", () => {
  const utils = jest.requireActual("../scripts/utils.js");
  const scanDirMocked = () => utils.scanDir("scripts-tests/utils-test-mock");

  return {
    ...utils,
    scanDir: jest.fn(scanDirMocked),
  };
});

const fs = require("fs");
jest.spyOn(fs, "writeFile");

const path = require("path");
const { styles } = require("../scripts/tasks.js");

describe("tasks", () => {
  beforeEach(() => {
    fs.writeFile.mockImplementation((a, b, c, callback) => {
        callback();
      });
  })

  describe("styles()", () => {
    it("compiles scss files of the project", async () => {
      await styles();

      expect(fs.writeFile).toHaveBeenCalledTimes(2);
      expect(fs.writeFile.mock.calls[0][0]).toBe(
        `scripts-tests${path.sep}utils-test-mock${path.sep}directory${path.sep}bar.css`,
      );
      expect(fs.writeFile.mock.calls[0][1]).toBe("a {\n  color: blue;\n}");
      expect(fs.writeFile.mock.calls[1][0]).toBe(
        `scripts-tests${path.sep}utils-test-mock${path.sep}foo.css`,
      );
      expect(fs.writeFile.mock.calls[1][1]).toBe("p {\n  color: red;\n}");
    });
  });
});
