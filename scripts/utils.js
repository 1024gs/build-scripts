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
  const result = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (let i = 0; i < files.length; i++) {
    if (files[i].isDirectory()) {
      const filesOfDirectory = scanDir(path.join(dir, files[i].name));
      for (let j = 0; j < filesOfDirectory.length; j++) {
        result.push(filesOfDirectory[j]);
      }
    } else {
      result.push(path.join(dir, files[i].name));
    }
  }

  return result;
};

const mkDirR = (targetDir) => {
  fs.mkdirSync(targetDir, { recursive: true });
};

const source =
  ({ findFiles } = { findFiles: () => undefined }) =>
  () => {
    return findFiles();
  };

const pipeline = ([source, ...fns]) => {
  const pipe = fns.reduce(
    (f, g) => (a) => f(a).then(g),
    (a) => Promise.resolve(a),
  );

  return ({ fileName } = {}) => {
    const fileNames = fileName || source();

    if (Array.isArray(fileNames)) {
      return Promise.all(fileNames.map((fileName) => pipe({ fileName })));
    } else {
      return pipe({ fileName: fileNames });
    }
  };
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
  mkDirR,

  pipeline,
  source,
};
