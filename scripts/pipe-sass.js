const sass = require("node-sass");

const pipe = (options) => ({ fileName, content }) => {
  return new Promise((resolve) => {
    const result = sass.renderSync({ data: content, file: fileName });

    resolve({ fileName, content: result.css });
  });
};

module.exports = {
  sass: pipe,
};
