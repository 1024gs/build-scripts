const { bundle } = require("./tasks-bundle.js");
const { concatenate } = require("./tasks-concatenate.js");
const { minifyCss, minifyJs } = require("./tasks-minify.js");
const { removeDevCode } = require("./tasks-remove-dev-code.js");

const build = async () => {
  await bundle({ isProduction: true });
  await concatenate();
  await removeDevCode();
  await minifyCss();
  await minifyJs();
};

return build();
