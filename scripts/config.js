const path = require("path");
const appRoot = path.resolve(__dirname, "../");
const { scanDir, test, is, not, any } = require("./utils.js");

const prependRoot = (x) => path.join(appRoot, x);

const removeRoot = (x) => x.replace(appRoot + path.sep, "").replace(/\\/g, "/");

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
