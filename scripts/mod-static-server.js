/**
 * Created by Sergiu Ghenciu on 08/12/2017
 */

const memoizeWith = (mFn, fn) => {
  const cache = {};
  return (...args) => {
    const key = mFn(...args);
    if (!cache.hasOwnProperty(key)) {
      cache[key] = fn(...args);
      // console.log(key, '->', cache[key]);
    }
    return cache[key];
  };
};

const yellow = (x) => `\x1b[33m${x}\x1b[0m`;
const green = (x) => `\x1b[32m${x}\x1b[0m`;
const red = (x) => `\x1b[31m${x}\x1b[0m`;
const magenta = (x) => `\x1b[35m${x}\x1b[0m`;
const cyan = (x) => `\x1b[36m${x}\x1b[0m`;
const grey = (x) => `\x1b[90m${x}\x1b[0m`;

const maxBy = (f, xs) => xs.reduce((a, x) => Math.max(a, f(x)), 0);
const pad = (x, n, a = "") => (n > 0 ? pad(x, n - 1, `${a}${x}`) : a);

const http = require("http");
const fs = require("fs");
const path = require("path");
const urlNode = require("url");
const { scanDir, isPrefixOf, isSuffixOf } = require("./utils.js");

const _mimeTypes = {
  ".ico": "image/x-icon",
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
};

const serverFactory = ({
  expose = [{ path: "./" }],
  index = "index.html",
  verbose,
  initialUrl = { pathname: "/" },
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
  const l = maxBy((x) => x.path.length, expose);
  console.log("SERVED PATHS:");
  expose.forEach((x) => {
    console.log(
      `   ${x.path}${pad(l - x.path.length, " ")} ${cyan("as")} ${x.as || "/"}`
    );
  });
  console.log("");
  /* ---------------------------- */

  const isDirectory = (x) => path.parse(x).ext === "";

  /*
  isDirectoryTest = () => {
    console.log('isDirectoryTest', isDirectory('/') === true);
    console.log('isDirectoryTest', isDirectory('/a') === true);
    console.log('isDirectoryTest', isDirectory('/a/') === true);
    console.log('isDirectoryTest', isDirectory('/a/b') === true);
    console.log('isDirectoryTest', isDirectory('./') === true);
    console.log('isDirectoryTest', isDirectory('../') === true);
    console.log('isDirectoryTest', isDirectory('.git') === true);
    console.log('isDirectoryTest', isDirectory('x.js') === false);
    console.log('isDirectoryTest', isDirectory('/a/x.css') === false);
    console.log('isDirectoryTest', isDirectory('/a/xyz.html') === false);
  }

  isDirectoryTest();
  */

  const removePrefix = (pfx, x) => x.substring(pfx.length);

  const mimes = { ..._mimeTypes, ...mimeTypes };

  let currentUrl = { ...initialUrl };

  const files = cache ? memoizeWith((x) => x, scanDir) : scanDir;

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
      const f = filePath(expose[i].path, expose[i].as, url);

      if (f !== null && files(expose[i].path).includes(f)) {
        return f;
      }
    }
    return null;
  };

  /*
  const findTest = () => {
    path.join = (a, b) => a + b;
    const _files = (path) => {
      const map = {
        '/a/b' : ['/a/b/x'],
        '/a/c': ['/a/c/x', '/a/c/y']
      }
      return map[path];
    };

    const expose1 = [{path: '/a/b', as: '/'}, {path: '/a/c', as: '/'}];
    const expose2 = [{path: '/a/b', as: '/d'}, {path: '/a/c', as: '/f'}];
    const expose3 = [{path: '/a/b', as: '/g'}, {path: '/a/c', as: '/g'}];
    const expose4 = [{path: '/a/b', as: '/c'}, {path: '/a/c', as: '/b'}];
    const expose5 = [{path: '/a/b', as: '/h'}, {path: '/a/b', as: '/'}];

    console.log('findTest / / /x  ', find('/x', expose1, _files) === '/a/b/x');
    console.log('findTest / / /y  ', find('/y', expose1, _files) === '/a/c/y');
    console.log('findTest / / /n  ', find('/n', expose1, _files) === null);

    console.log('findTest d f /x  ', find('/x', expose2, _files) === null);
    console.log('findTest d f /y  ', find('/y', expose2, _files) === null);
    console.log('findTest d f /d/y', find('/d/y', expose2, _files) === null);
    console.log('findTest d f /f/y', find('/f/y', expose2, _files) === '/a/c/y');
    console.log('findTest d f /d/x', find('/d/x', expose2, _files) === '/a/b/x');
    console.log('findTest d f /f/x', find('/f/x', expose2, _files) === '/a/c/x');

    console.log('findTest g g /x  ', find('/x', expose3, _files) === null);
    console.log('findTest g g /y  ', find('/y', expose3, _files) === null);
    console.log('findTest g g /g/x', find('/g/x', expose3, _files) === '/a/b/x');
    console.log('findTest g g /g/y', find('/g/y', expose3, _files) === '/a/c/y');

    console.log('findTest c b /c/x', find('/c/x', expose4, _files) === '/a/b/x');
    console.log('findTest c b /b/x', find('/b/x', expose4, _files) === '/a/c/x');
    console.log('findTest c b /b/y', find('/b/y', expose4, _files) === '/a/c/y');
    console.log('findTest c b /c/y', find('/c/y', expose4, _files) === null);

    console.log('findTest h / /h/x', find('/h/x', expose5, _files) === '/a/b/x');
    console.log('findTest h / /x  ', find('/x', expose5, _files) === '/a/b/x');
    console.log('findTest h / /x/h', find('/x/h', expose5, _files) === null);
  }

  findTest();
  */

  const appendIdx = (index, url) =>
    (isSuffixOf("/", url) ? url.substring(0, url.length - 1) : url) +
    "/" +
    (isPrefixOf("/", index) ? removePrefix("/", index) : index);

  /*
  appendIdxTest = () => {
    console.log('appendIdx(b, a)   === a/b ->', appendIdx('b', 'a') === 'a/b');
    console.log('appendIdx(/b, a)  === a/b ->', appendIdx('/b', 'a') === 'a/b');
    console.log('appendIdx(b, a/)  === a/b ->', appendIdx('b', 'a/') === 'a/b');
    console.log('appendIdx(/b, a/) === a/b ->', appendIdx('/b', 'a/') === 'a/b');
  }

  appendIdxTest();
  */

  const _resolve = (index, url) => {
    // 1. try the happy path
    let f = find(expose, files, url);
    if (f !== null) {
      return f;
    }

    // 2. if it's a directory, append the`index` and look up again
    if (isDirectory(url)) {
      f = find(expose, files, appendIdx(index, url));
      if (f !== null) {
        return f;
      }
    }

    return null;
  };

  const notFoundLog = (index, url) => {
    if (expose.every((x) => !isPrefixOf(x.as, url))) {
      return `The url ${yellow(url)} does not exist the in exposed paths`;
    }

    let r = red("NONE WAS FOUND:");

    for (let i = 0; i < expose.length; i++) {
      const f = filePath("/", expose[i].as, url);
      if (f !== null) {
        r += `\n   ${expose[i].path}${cyan(expose[i].as)}${f}`;
      }
    }

    if (isDirectory(url)) {
      for (let i = 0; i < expose.length; i++) {
        const f = filePath("/", expose[i].as, appendIdx(index, url));
        if (f !== null) {
          r += `\n   ${expose[i].path}${cyan(expose[i].as)}${f}`;
        }
      }
    }

    return r;
  };

  let instance;
  const listen = (port, cb) => {
    instance = http
      .createServer((req, res) => {
        const parsedUrl = urlNode.parse(req.url);
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
        fs.stat(file, (err, stat) => {
          if (err) {
            res.statusCode = 500;
            res.end(`FAILED TO READING THE FILE: ${parsedUrl.pathname}`);
            console.log(red("ERROR:"), err.message);
          } else {
            const ext = path.parse(file).ext;

            res.writeHead(200, {
              "Content-Type": mimes[ext] || "text/plain",
              "Content-Length": stat.size,
            });
            const readStream = fs.createReadStream(file);
            readStream.pipe(res);

            // Todo: We need browser's current url
            if (ext === ".html" || isDirectory(file)) {
              currentUrl = parsedUrl;
              currentUrl.filePath = file;
            }
            if (verbose) {
              console.log(`${cyan(req.method)} ${req.url}`);
            }
          }
        });
        /* ---------------------------------------------*/
      })
      .listen(port, cb);
  };

  const gerCurrentUrl = () => currentUrl;

  return {
    listen,
    close: () => instance.close(),
    gerCurrentUrl,
  };
};

module.exports = serverFactory;
