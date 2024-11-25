const { bundle } = require("./mod-bundle.js");
const { concatenate } = require("./mod-concatenate.js");

const build = async () => {
  await bundle({ isProduction: true });
  await concatenate();
};

return build();
