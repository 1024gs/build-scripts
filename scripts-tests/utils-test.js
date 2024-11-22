const path = require("path");
const {
  curry,
  all,
  any,
  not,
  isPrefixOf,
  isSuffixOf,
  is,
  isNot,
  test,
  uniq,
  once,
  scanDir,
  source,
  pipeline,
} = require("../scripts/utils.js");

describe("utils", () => {
  describe("curry(fn)", () => {
    const add = (a, b) => a + b;
    const addCurried = curry(add);

    it("returns a curried function", () => {
      expect(addCurried(1, 2)).toEqual(3);
      expect(addCurried(1)(2)).toEqual(3);
    });
  });

  describe("all(predicates, x)", () => {
    const greaterThan1 = (x) => x > 1;
    const equals2 = (x) => x === 2;
    const isEven = (x) => x % 2 === 0;

    it("reports whether all predicates are satisfied by a given value x", () => {
      expect(all([greaterThan1, equals2, isEven], 2)).toEqual(true);
      expect(all([greaterThan1, equals2], 3)).toEqual(false);
      expect(all([greaterThan1, equals2], 0)).toEqual(false);
    });

    it("returns true for an empty predicate list", () => {
      expect(all([], 2)).toEqual(true);
    });

    it("returns a curried function", () => {
      expect(all([equals2], 2)).toEqual(true);
      expect(all([equals2])(2)).toEqual(true);
    });
  });

  describe("any(predicates, x)", () => {
    const greaterThan1 = (x) => x > 1;
    const equals2 = (x) => x === 2;
    const isEven = (x) => x % 2 === 0;

    it("reports whether any predicates are satisfied by a given value x", () => {
      expect(any([greaterThan1, equals2, isEven], 2)).toEqual(true);
      expect(any([greaterThan1, equals2], 3)).toEqual(true);
      expect(any([greaterThan1, equals2], 0)).toEqual(false);
    });

    it("returns false for an empty predicate list", () => {
      expect(any([], 2)).toEqual(false);
    });

    it("returns a curried function", () => {
      expect(any([equals2], 2)).toEqual(true);
      expect(any([equals2])(2)).toEqual(true);
    });
  });

  describe("not(predicate, x)", () => {
    const equals2 = (x) => x === 2;

    it("negates the predicate", () => {
      expect(not(equals2, 1)).toEqual(true);
      expect(not(equals2, 2)).toEqual(false);
    });

    it("returns a curried function", () => {
      expect(not(equals2, 3)).toEqual(true);
      expect(not(equals2)(3)).toEqual(true);
    });
  });

  describe("isPrefixOf(b, a)", () => {
    it("reports if string b is prefix of string a", () => {
      expect(isPrefixOf("foo", "foo/bar")).toEqual(true);
      expect(isPrefixOf("bar", "foo/bar")).toEqual(false);
    });

    it("returns a curried function", () => {
      expect(isPrefixOf("foo", "foo/bar")).toEqual(true);
      expect(isPrefixOf("foo")("foo/bar")).toEqual(true);
    });
  });

  describe("isSuffixOf(b, a)", () => {
    it("reports if string b is suffix of string a", () => {
      expect(isSuffixOf("bar", "foo/bar")).toEqual(true);
      expect(isSuffixOf("foo", "foo/bar")).toEqual(false);
    });

    it("returns a curried function", () => {
      expect(isSuffixOf("bar", "foo/bar")).toEqual(true);
      expect(isSuffixOf("bar")("foo/bar")).toEqual(true);
    });
  });

  describe("is(ext, fileName)", () => {
    it("reports whether fileName is of the given extention ext", () => {
      expect(is(".js", "foo.js")).toEqual(true);
      expect(is(".css", "foo.js")).toEqual(false);
    });

    it("returns a curried function", () => {
      expect(is(".js", "foo.js")).toEqual(true);
      expect(is(".js")("foo.js")).toEqual(true);
    });
  });

  describe("isNot(ext, fileName)", () => {
    it("reports whether fileName is NOT of the given extention ext", () => {
      expect(isNot(".css", "foo.js")).toEqual(true);
      expect(isNot(".js", "foo.js")).toEqual(false);
    });

    it("returns a curried function", () => {
      expect(isNot(".css", "foo.js")).toEqual(true);
      expect(isNot(".css")("foo.js")).toEqual(true);
    });
  });

  describe("test(regexp, x)", () => {
    it("reports whether x matches the regular expression regexp", () => {
      expect(test(/\.js$/, "foo.js")).toEqual(true);
      expect(test(/^_/, "_vars.scss")).toEqual(true);
      expect(test(/bar/, "foo/bar/baz")).toEqual(true);
      expect(test(/\.js/, "foo/bar")).toEqual(false);
    });

    it("returns a curried function", () => {
      expect(test(/\.js$/, "foo.js")).toEqual(true);
      expect(test(/\.js$/)("foo.js")).toEqual(true);
    });
  });

  describe("uniq(xs)", () => {
    it("returns a uniq set from the given array xs", () => {
      expect(uniq([1, 1, 1])).toEqual([1]);
      expect(uniq([1, 1, 1, 2, 2, 2])).toEqual([1, 2]);
    });

    it("returns an empty array for an empty array", () => {
      expect(uniq([])).toEqual([]);
    });

    it("keeps elements from the left", () => {
      expect(uniq([1, 2, 3, 1])).toEqual([1, 2, 3]);
    });

    it("does not modify the source", () => {
      const source = [1, 1, 1];
      const result = uniq(source);
      expect(source).toEqual([1, 1, 1]);
      expect(result).toEqual([1]);
    });
  });
  describe("once(fn)", () => {
    let counter = 0;
    const increment = () => ++counter;
    const incrementOnce = once(increment);
    incrementOnce();
    incrementOnce();

    it("limits the function fn to be called only once", () => {
      expect(counter).toEqual(1);
    });

    it("the function fn always returns the value from the first call", () => {
      expect(incrementOnce()).toEqual(1);
    });
  });

  describe("scanDir(dir)", () => {
    it("recursevely scans the directory dir and returns a list of all the files", () => {
      expect(scanDir("scripts-tests/test-mock").sort()).toEqual(
        [
          `scripts-tests${path.sep}test-mock${path.sep}directory${path.sep}bar.css`,
          `scripts-tests${path.sep}test-mock${path.sep}directory${path.sep}bar.js`,
          `scripts-tests${path.sep}test-mock${path.sep}directory${path.sep}bar.scss`,
          `scripts-tests${path.sep}test-mock${path.sep}directory${path.sep}bar.ts`,
          `scripts-tests${path.sep}test-mock${path.sep}directory${path.sep}directory${path.sep}baz.css`,
          `scripts-tests${path.sep}test-mock${path.sep}directory${path.sep}directory${path.sep}baz.js`,
          `scripts-tests${path.sep}test-mock${path.sep}foo.css`,
          `scripts-tests${path.sep}test-mock${path.sep}foo.js`,
          `scripts-tests${path.sep}test-mock${path.sep}foo.scss`,
          `scripts-tests${path.sep}test-mock${path.sep}foo.ts`,
          `scripts-tests${path.sep}test-mock${path.sep}index.html`,
          `scripts-tests${path.sep}test-mock${path.sep}_vars.scss`,
        ].sort(),
      );
    });
  });

  describe("source({ findFiles })", () => {
    it("tells the pipeline how to find the source files", () => {
      const findFiles = () => ["foo.js", "bar.js"];
      expect(source({ findFiles })()).toEqual(["foo.js", "bar.js"]);
    });

    it("defaults to undefined", () => {
      expect(source()()).toEqual(undefined);
    });
  });

  describe("pipeline([source, ...fns])", () => {
    it("builds a pipeline", async () => {
      const pipe1 =
        (options) =>
        ({ fileName, content }) => {
          expect(fileName).toBe(undefined);
          expect(content).toBe(undefined);
          return { fileName: "foo", content: "bar" };
        };

      const pipe2 =
        (options) =>
        ({ fileName, content }) => {
          expect(fileName).toBe("foo");
          expect(content).toBe("bar");
          return { fileName, content };
        };

      const myPipeline = pipeline([
        source(), // source must always be here. It is a special pipe.
        pipe1(),
        pipe2(),
      ]);

      await myPipeline();
    });

    it("takes a single file", async () => {
      const pipe1 =
        (options) =>
        ({ fileName, content }) => {
          expect(fileName).toBe("foo");
          return { fileName, content };
        };

      const myPipeline = pipeline([
        source({ findFiles: () => "foo" }), // source must always be here. It is a special pipe.
        pipe1(),
      ]);

      await myPipeline();
    });

    it("takes an array of files", async () => {
      const spy = jest.fn();

      const pipe1 =
        (options) =>
        ({ fileName, content }) => {
          spy(fileName);
          return { fileName, content };
        };

      const myPipeline = pipeline([
        source({ findFiles: () => ["foo", "bar"] }), // source must always be here. It is a special pipe.
        pipe1(),
      ]);

      await myPipeline();

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy.mock.calls[0][0]).toBe("foo");
      expect(spy.mock.calls[1][0]).toBe("bar");
    });

    it("overrides the file", async () => {
      const pipe1 =
        (options) =>
        ({ fileName, content }) => {
          expect(fileName).toBe("baz");
          return { fileName, content };
        };

      const myPipeline = pipeline([
        source({ findFiles: () => ["foo", "bar"] }), // source must always be here. It is a special pipe.
        pipe1(),
      ]);

      await myPipeline({ fileName: "baz" });
    });

    it("the pipes can be asynchronous", async () => {
      const pipe1 =
        (options) =>
        async ({ fileName, content }) => {
          expect(fileName).toBe(undefined);
          expect(content).toBe(undefined);
          return { fileName: "foo", content: "bar" };
        };

      const pipe2 =
        (options) =>
        async ({ fileName, content }) => {
          expect(fileName).toBe("foo");
          expect(content).toBe("bar");
          return { fileName, content };
        };

      const myPipeline = pipeline([
        source(), // source must always be here. It is a special pipe.
        pipe1(),
        pipe2(),
      ]);

      await myPipeline();
    });
  });
});
