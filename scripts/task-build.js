const { bundle } = require("./mod-bundle.js");
const { concatenate } = require("./mod-concatenate.js");
const { minifyCss, minifyJs } = require("./mod-minify.js");
const { removeDevCode } = require("./mod-remove-dev-code.js");

const build = async () => {
  await bundle({ isProduction: true });
  await concatenate();
  await removeDevCode();
  await minifyCss();
  await minifyJs();
};

return build();
