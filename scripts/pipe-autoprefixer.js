const autoprefixer = require("autoprefixer");
const postcss = require("postcss");

const pipe =
  (options) =>
  async ({ fileName, content }) => {
    const result = await postcss([autoprefixer]).process(content, {
      from: fileName,
    });
    result.warnings().forEach((warn) => {
      console.warn(warn.toString());
    });
    return { fileName, content: result.css };
  };

module.exports = {
  autoprefixer: pipe,
};
