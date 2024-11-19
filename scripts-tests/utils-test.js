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

    it("the function fn always returns the first value", () => {
      expect(incrementOnce()).toEqual(1);
    });
  });

  describe("scanDir(dir)", () => {
    it("recursevely scans the directory dir and returns a list of all the files", () => {
      expect(scanDir("scripts-tests/utils-test-mock")).toEqual([
        `scripts-tests${path.sep}utils-test-mock${path.sep}directory${path.sep}bar.css`,
        `scripts-tests${path.sep}utils-test-mock${path.sep}directory${path.sep}bar.js`,
        `scripts-tests${path.sep}utils-test-mock${path.sep}directory${path.sep}bar.scss`,
        `scripts-tests${path.sep}utils-test-mock${path.sep}directory${path.sep}directory${path.sep}baz.css`,
        `scripts-tests${path.sep}utils-test-mock${path.sep}directory${path.sep}directory${path.sep}baz.js`,
        `scripts-tests${path.sep}utils-test-mock${path.sep}foo.css`,
        `scripts-tests${path.sep}utils-test-mock${path.sep}foo.js`,
        `scripts-tests${path.sep}utils-test-mock${path.sep}foo.scss`,
        `scripts-tests${path.sep}utils-test-mock${path.sep}foo.ts`,
        `scripts-tests${path.sep}utils-test-mock${path.sep}_vars.scss`,
      ]);
    });
  });

  describe("source({ findFiles })", () => {
    it("returns a function that when called, calls findFiles() and returns its result", () => {
      const findFiles = () => ["foo.js", "bar.js"];
      const getFiles = source({ findFiles });
      expect(getFiles()).toEqual(findFiles());
    });

    it("findFiles defaults to () => undefined", () => {
      const getFiles = source();
      expect(getFiles()).toEqual(undefined);
    });
  });
});
