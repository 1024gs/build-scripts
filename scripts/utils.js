const fs = require("fs");
const path = require("path");

const all = (predicates, x) => predicates.every((f) => f(x));
const any = (predicates, x) => predicates.some((f) => f(x));
const not = (pred, x) => !pred(x);
const isPrefixOf = (b, a) => a.substring(0, b.length) === b;
const isSuffixOf = (b, a) => a.substring(a.length - b.length, a.length) === b;
const is = (ext, fileName) => isSuffixOf(ext, fileName);
const isNot = (ext, fileName) => !isSuffixOf(ext, fileName);
const test = (regexp, x) => regexp.test(x);

const curry = (fn) =>
  function (a, b) {
    if (arguments.length === 1) {
      return function (_b) {
        return fn(a, _b);
      };
    }
    return fn(a, b);
  };

const uniq = (xs) => {
  const result = [];
  const map = {};
  let i = 0;
  let j = 0;
  while (i < xs.length) {
    if (map[xs[i]] !== true) {
      map[xs[i]] = true;
      result[j] = xs[i];
      j += 1;
    }
    i += 1;
  }
  return result;
};

const once = (fn) => {
  let called = false;
  let result;
  return (...args) => {
    if (called) {
      return result;
    }
    called = true;
    result = fn(...args);
    return result;
  };
};

const scanDir = (dir) => {
  return fs
    .readdirSync(dir)
    .reduce(
      (a, x) =>
        fs.statSync(path.join(dir, x)).isDirectory()
          ? a.concat(scanDir(path.join(dir, x)))
          : a.concat(path.join(dir, x)),
      []
    );
};

const source = ({ findFiles } = { findFiles: () => undefined }) => () => {
  return findFiles();
};

const pipeline = ([source, ...fns]) => {
  const fileNames = source();
  const pipe = fns.reduce(
    (f, g) => (a) => f(a).then(g),
    (a) => Promise.resolve(a)
  );

  if (Array.isArray(fileNames)) {
    return ({ fileName } = {}) =>
      fileName
        ? pipe({ fileName })
        : Promise.all(fileNames.map((fileName) => pipe({ fileName })));
  }

  return ({ fileName } = { fileName: fileNames }) => pipe({ fileName });
};

module.exports = {
  curry,
  uniq,
  once,
  all: curry(all),
  any: curry(any),
  not: curry(not),
  isPrefixOf: curry(isPrefixOf),
  isSuffixOf: curry(isSuffixOf),
  is: curry(is),
  isNot: curry(isNot),
  test: curry(test),

  scanDir,

  pipeline,
  source,
};
