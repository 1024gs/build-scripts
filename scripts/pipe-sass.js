const sass = require("sass");

const pipe = (options) => ({ fileName, content }) => {
  return new Promise((resolve) => {
    const result = sass.renderSync({ data: content, file: fileName });
    resolve({ fileName, content: result.css.toString() });
  });
};

module.exports = {
  sass: pipe,
};
