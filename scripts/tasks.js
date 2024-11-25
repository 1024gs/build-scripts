const { scssSource, tsSource } = require("./config.js");
const { cssDestination, jsDestination } = require("./config.js");
const { read } = require("./pipe-read.js");
const { write } = require("./pipe-write.js");
const { sass } = require("./pipe-sass.js");
const { autoprefixer } = require("./pipe-autoprefixer.js");
const { babel } = require("./pipe-babel.js");
const { typescript } = require("./pipe-typescript.js");
const { pipeline, source } = require("./utils.js");

const styles = pipeline([
  source({ findFiles: scssSource }),
  read(),
  sass(),
  autoprefixer(),
  write({ destination: cssDestination }),
]);

const scripts = pipeline([
  source({ findFiles: tsSource }),
  read(),
  typescript(),
  babel(),
  write({ destination: jsDestination }),
]);

const buildBootstrap = pipeline([
  source({ findFiles: () => "vendors/bootstrap/scss/bootstrap.scss" }),
  read(),
  sass(),
  autoprefixer(),
  write({ destination: () => "vendors/bootstrap/dist/css/bootstrap.css" }),
]);

module.exports = {
  styles,
  scripts,
  buildBootstrap,
};
