const path = require("path");
const appRoot = path.resolve(__dirname, "../");
const { scanDir, is, not, any, isPrefixOf } = require("./utils.js");

const prependRoot = (x) =>
  !isPrefixOf(appRoot, x) ? path.join(appRoot, x) : x;

const removeRoot = (x) =>
  isPrefixOf(appRoot, x) ? x.substring(`${appRoot}${path.sep}`.length) : x;

const isSassSubmodule = (fileName) => /_.*\.scss/.test(fileName);

const scssSource = () =>
  scanDir(prependRoot("src")).filter(is(".scss")).filter(not(isSassSubmodule));

const tsSource = () =>
  scanDir(prependRoot("src")).filter(any([is(".ts"), is(".tsx")]));

const cssDestination = (fileName) => fileName.replace(/\.scss$/, ".css");

const jsDestination = (fileName) => fileName.replace(/\.tsx?$/, ".js");

module.exports = {
  prependRoot,
  removeRoot,
  isSassSubmodule,
  scssSource,
  tsSource,
  cssDestination,
  jsDestination,
};
