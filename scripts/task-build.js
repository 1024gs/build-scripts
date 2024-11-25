const { bundle } = require("./mod-bundle.js");
const { concatenate } = require("./mod-concatenate.js");
const { removeDevCode } = require("./mod-remove-dev-code.js");

const build = async () => {
  await bundle({ isProduction: true });
  await concatenate();
  await removeDevCode();
};

return build();
