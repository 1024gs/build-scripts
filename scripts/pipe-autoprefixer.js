const autoprefixer = require("autoprefixer");
const postcss = require("postcss");

const pipe = (options) => ({ fileName, content }) => {
  return new Promise((resolve) => {
    postcss([autoprefixer])
      .process(content, { from: fileName })
      .then((result) => {
        result.warnings().forEach((warn) => {
          console.warn(warn.toString());
        });
        resolve({ fileName, content: result.css });
      });
  });
};

module.exports = {
  autoprefixer: pipe,
};
