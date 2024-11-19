const config = require("../scripts/config.js");
jest
  .spyOn(config, "scssSource")
  .mockImplementation(() => [
    "scripts-tests/utils-test-mock/directory/bar.scss",
    "scripts-tests/utils-test-mock/foo.scss",
  ]);
jest
  .spyOn(config, "tsSource")
  .mockImplementation(() => [
    "scripts-tests/utils-test-mock/directory/bar.ts",
    "scripts-tests/utils-test-mock/foo.ts",
  ]);

const fs = require("fs");
jest.spyOn(fs, "writeFile").mockImplementation((a, b, c, callback) => {
  callback();
});

const { styles, scripts } = require("../scripts/tasks.js");

describe("tasks", () => {
  beforeEach(() => {
    fs.writeFile.mockClear();
  });

  describe("styles()", () => {
    it("compiles scss files of the project", async () => {
      await styles();

      expect(fs.writeFile).toHaveBeenCalledTimes(2);
      expect(fs.writeFile.mock.calls[0][0]).toBe(
        `scripts-tests/utils-test-mock/directory/bar.css`,
      );
      expect(fs.writeFile.mock.calls[0][1]).toBe("a {\n  color: blue;\n}");
      expect(fs.writeFile.mock.calls[1][0]).toBe(
        `scripts-tests/utils-test-mock/foo.css`,
      );
      expect(fs.writeFile.mock.calls[1][1]).toBe("p {\n  color: red;\n}");
    });
  });

  describe("scripts()", () => {
    it("transpiles ts files of the project", async () => {
      await scripts();

      expect(fs.writeFile).toHaveBeenCalledTimes(2);
      expect(fs.writeFile.mock.calls[0][0]).toBe(
        `scripts-tests/utils-test-mock/directory/bar.js`,
      );
      expect(fs.writeFile.mock.calls[0][1]).toBe(
        '"use strict";\n\nconst add = (a, b) => a + b;',
      );
      expect(fs.writeFile.mock.calls[1][0]).toBe(
        `scripts-tests/utils-test-mock/foo.js`,
      );
      expect(fs.writeFile.mock.calls[1][1]).toBe(
        '"use strict";\n\nconst x = 1;',
      );
    });
  });
});
