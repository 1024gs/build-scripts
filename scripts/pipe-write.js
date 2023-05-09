const fs = require("fs");

const pipe = ({ destination }) => ({ fileName, content }) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(destination(fileName), content, "utf8", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fileName, content });
      }
    });
  });
};

module.exports = {
  write: pipe,
};
