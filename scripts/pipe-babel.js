const { appRoot } = require("./config.js");
const babel = require("@babel/core");
const babelConfig = require("../babel.config.json");

const pipe = (options) => ({ fileName, content }) => {
  return new Promise((resolve) => {
    const result = babel.transformSync(content, {
      ...babelConfig,
      filename: fileName,
      root: appRoot,
      configFile: false,
      babelrc: false,
    });

    resolve({ fileName, content: result.code });
  });
};

module.exports = {
  babel: pipe,
};
