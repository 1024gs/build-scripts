const ts = require("typescript");
const tsConfig = require("../tsconfig.json");

const pipe = (options) => ({ fileName, content }) => {
  return new Promise((resolve) => {
    const result = ts.transpileModule(content, {
      ...tsConfig,
      fileName: fileName,
      noEmit: true,
    });

    resolve({ fileName, content: result.outputText });
  });
};

module.exports = {
  typescript: pipe,
};
