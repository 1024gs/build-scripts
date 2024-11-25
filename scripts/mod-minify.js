const csso = require("csso");
const uglifyES = require("uglify-es");
const { read } = require("./pipe-read");
const { write } = require("./pipe-write");
const { is, scanDir, pipeline, source } = require("./utils");

const cssFiles = () => scanDir("dist").filter(is(".css"));

const cssoPipe =
  (options) =>
  ({ fileName, content }) => {
    const result = csso.minify(content);

    return { fileName, content: result.css };
  };

const nCache = {};
const uglifyJSOptions = {
  compress: {
    inline: false,
    collapse_vars: false,
    drop_console: true,
    keep_infinity: true,
    typeofs: false,
    hoist_funs: false,
    hoist_props: false,
    hoist_vars: false,
  },
  mangle: {
    eval: false,
    keep_fnames: false,
    properties: false,
    toplevel: false,
  },
  output: {
    beautify: false,
    max_line_len: 500,
    quote_style: 1,
  },
  ie8: false,
  sourceMap: false,
  toplevel: true,
  keep_fnames: false,
  nameCache: nCache,
};

const jsFiles = () => scanDir("dist").filter(is(".js"));

const uglifyESPipe =
  (options) =>
  ({ fileName, content }) => {
    const result = uglifyES.minify(content, uglifyJSOptions);

    return { fileName, content: result.code };
  };

const minifyCss = pipeline([
  source({ findFiles: cssFiles }),
  read(),
  cssoPipe(),
  write({ destination: (fileName) => fileName }),
]);

const minifyJs = pipeline([
  source({ findFiles: jsFiles }),
  read(),
  uglifyESPipe(),
  write({ destination: (fileName) => fileName }),
]);

module.exports = {
  minifyCss,
  minifyJs,
};
