const utils = require("../scripts/utils.js");
jest.spyOn(utils, "scanDir");

const path = require("path");
const {
  prependRoot,
  removeRoot,
  isSassSubmodule,
  cssDestination,
  jsDestination,
  scssSource,
  tsSource,
} = require("../scripts/config.js");

describe("config", () => {
  describe("prependRoot(x)", () => {
    const rootDir = path.resolve(__dirname, "../");

    it("prepends the path of the root directory of the project to x", () => {
      expect(prependRoot("foo")).toEqual(path.join(rootDir, "foo"));
    });

    it("does not prepend if x is a full path already", () => {
      const fullPath = path.join(rootDir, "foo");
      expect(prependRoot(fullPath)).toEqual(path.join(rootDir, "foo"));
    });
  });

  describe("removeRoot(x)", () => {
    const rootDir = path.resolve(__dirname, "../");

    it("return the relative path", () => {
      const fullPath = path.join(rootDir, "foo");
      expect(removeRoot(fullPath)).toEqual("foo");
    });

    it("does not change a relative path", () => {
      expect(removeRoot("foo")).toEqual("foo");
    });
  });

  describe("isSassSubmodule(fileName)", () => {
    it("returns true if fileName is a .scss file and starts with _", () => {
      expect(isSassSubmodule("_foo.scss")).toEqual(true);
    });

    it("returns false if the file does not start with _", () => {
      expect(isSassSubmodule("foo.scss")).toEqual(false);
      expect(isSassSubmodule("_foo.js")).toEqual(false);
    });
  });

  describe("cssDestination(fileName)", () => {
    it("returns the same destination as scss file", () => {
      expect(cssDestination("foo/bar.scss")).toEqual("foo/bar.css");
    });
  });

  describe("jsDestination(fileName)", () => {
    it("returns the same destination as ts file", () => {
      expect(jsDestination("foo/bar.ts")).toEqual("foo/bar.js");
      expect(jsDestination("foo/bar.tsx")).toEqual("foo/bar.js");
    });
  });

  describe("scssSource()", () => {
    it("returns the list of the scss files of the project", () => {
      utils.scanDir.mockImplementation(() => ["foo.scss", "bar.scss"]);
      expect(scssSource()).toEqual(["foo.scss", "bar.scss"]);
    });

    it("filters out non scss files and sass submodules", () => {
      utils.scanDir.mockImplementation(() => [
        "foo.css",
        "foo.scss",
        "_foo.scss",
        "foo.js",
      ]);
      expect(scssSource()).toEqual(["foo.scss"]);
    });
  });

  describe("tsSource()", () => {
    it("returns the list of the ts files of the project", () => {
      utils.scanDir.mockImplementation(() => [
        "foo.ts",
        "foo.tsx",
        "bar.ts",
        "foo.css",
        "foo.scss",
      ]);
      expect(tsSource()).toEqual(["foo.ts", "foo.tsx", "bar.ts"]);
    });
  });
});
