const sass = require("sass");

const pipe =
  (options) =>
  ({ fileName, content }) => {
    const result = sass.renderSync({ data: content, file: fileName });

    return { fileName, content: result.css.toString() };
  };

module.exports = {
  sass: pipe,
};
