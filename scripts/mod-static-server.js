const http = require("http");
const fs = require("fs");
const path = require("path");
const urlparser = require("url");
const { scanDir, isPrefixOf, isSuffixOf } = require("./utils.js");

const red = (x) => `\x1b[31m${x}\x1b[0m`;
const cyan = (x) => `\x1b[36m${x}\x1b[0m`;

const removePrefix = (prefix, x) =>
  isPrefixOf(prefix, x) ? x.substring(prefix.length) : x;

const removeSuffix = (suffix, x) =>
  isSuffixOf(suffix, x) ? x.substring(0, x.length - 1) : x;

const appendIndex = (index, url) =>
  removeSuffix("/", url) + "/" + removePrefix("/", index);

const doesNotHaveExtension = (url) => path.parse(url).ext === "";

const memoizeWith = (mFn, fn) => {
  const cache = {};
  return (...args) => {
    const key = mFn(...args);
    if (!cache.hasOwnProperty(key)) {
      cache[key] = fn(...args);
    }
    return cache[key];
  };
};

/*
* Given: expose = {path: /src, as: /x}
*        url = /x/foo.js

* Required: the file `/src/foo.js` to be available at the given url

* Solution: We could remove prefix `/x` from url
*           removePrefix(/x, /x/foo.js) -> /foo.js
*/
const filePath = (root, exposeAs, url) => {
  if (typeof exposeAs === "undefined" || exposeAs === "/") {
    return path.join(root, url);
  }
  if (isPrefixOf(exposeAs, url)) {
    return path.join(root, removePrefix(exposeAs, url));
  }
  return null;
};

const find = (expose, files, url) => {
  for (let i = 0; i < expose.length; i++) {
    const file = filePath(expose[i].path, expose[i].as, url);

    if (file !== null && files(expose[i].path).includes(file)) {
      return file;
    }
  }
  return null;
};

const _mimeTypes = {
  ".ico": "image/x-icon",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const staticServer = ({
  expose = [{ path: "./" }],
  index = "index.html",
  verbose,
  mimeTypes = {},
  cache = true,
  resolve = () => null,
} = {}) => {
  /* console log the served paths */
  if (cache) {
    console.log("CACHE IS ENABLED!");
    console.log("   Just restart the server if you create a new file");
    console.log("");
  }
  /* ---------------------------- */

  /* console log the served paths */
  console.log("SERVED PATHS:");
  expose.forEach((x) => {
    console.log(`   ${x.path} ${cyan("as")} ${x.as || "/"}`);
  });
  console.log("");
  /* ---------------------------- */

  const mimes = { ..._mimeTypes, ...mimeTypes };

  const filesOnDisk = cache ? memoizeWith((x) => x, scanDir) : scanDir;

  const _resolve = (index, url) => {
    // 1. try the happy path
    let file = find(expose, filesOnDisk, url);
    if (file !== null) {
      return file;
    }

    // 2. if url doesn't have extention, append the`index` and look up again
    if (doesNotHaveExtension(url)) {
      file = find(expose, filesOnDisk, appendIndex(index, url));
      if (file !== null) {
        return file;
      }
    }

    return null;
  };

  const notFoundLog = (index, url) => {
    let log = red("NONE WAS FOUND:");

    for (let i = 0; i < expose.length; i++) {
      const file = filePath(expose[i].path, expose[i].as, url);
      if (file !== null) {
        log += `\n   ${file}`;
      }
    }

    if (doesNotHaveExtension(url)) {
      for (let i = 0; i < expose.length; i++) {
        const file = filePath(
          expose[i].path,
          expose[i].as,
          appendIndex(index, url),
        );
        if (file !== null) {
          log += `\n   ${file}`;
        }
      }
    }

    return log;
  };

  return http.createServer((req, res) => {
    const parsedUrl = urlparser.parse(req.url);

    // 1. Try external resolver
    let file = resolve(parsedUrl.pathname);
    // 2. Otherwise internal resolver
    if (file === null) {
      file = _resolve(index, parsedUrl.pathname);
    }

    if (file === null) {
      res.statusCode = 404;
      res.end(`Not Found: ${parsedUrl.pathname}`);
      console.log(notFoundLog(index, parsedUrl.pathname));
      return;
    }

    /* ------------ sending the file ------------- */
    try {
      const content = fs.readFileSync(file, "utf8");
      const ext = path.parse(file).ext;
      res.statusCode = 200;
      res.setHeader("Content-Type", mimes[ext] || "text/plain");
      res.end(content);

      if (verbose) {
        console.log(`${cyan(req.method)} ${parsedUrl.pathname}`);
      }
    } catch (err) {
      res.statusCode = 500;
      res.end(`FAILED TO READ THE FILE: ${parsedUrl.pathname}`);
      console.log(red("ERROR:"), err.message);
    }
    /* ---------------------------------------------*/
  });
};

module.exports = {
  staticServer,
  filePath,
  find,
  red,
  cyan,
  appendIndex,
  doesNotHaveExtension,
};
