const { appRoot } = require("./config.js");
const babel = require("@babel/core");
const babelConfig = require("../babel.config.json");

const pipe =
  (options) =>
  ({ fileName, content }) => {
    const result = babel.transformSync(content, {
      ...babelConfig,
      filename: fileName,
      root: appRoot,
      configFile: false,
      babelrc: false,
    });

    return { fileName, content: result.code };
  };

module.exports = {
  babel: pipe,
};
