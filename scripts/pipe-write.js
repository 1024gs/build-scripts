const fs = require("fs");

const pipe =
  ({ destination }) =>
  ({ fileName, content }) => {
    fs.writeFileSync(destination(fileName), content);

    return { fileName, content };
  };

module.exports = {
  write: pipe,
};
