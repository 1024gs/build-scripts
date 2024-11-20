const ts = require("typescript");
const tsConfig = require("../tsconfig.json");

const pipe =
  (options) =>
  ({ fileName, content }) => {
    const result = ts.transpileModule(content, {
      ...tsConfig,
      fileName: fileName,
      noEmit: true,
    });

    return { fileName, content: result.outputText };
  };

module.exports = {
  typescript: pipe,
};
