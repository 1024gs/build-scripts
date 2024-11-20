const fs = require("fs");

const pipe =
  (options) =>
  ({ fileName }) => {
    const result = fs.readFileSync(fileName, "utf8");

    return { fileName, content: result };
  };

module.exports = {
  read: pipe,
};
