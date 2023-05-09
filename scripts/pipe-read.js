const fs = require("fs");

const pipe = (options) => ({ fileName }) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf8", (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fileName, content });
      }
    });
  });
};

module.exports = {
  read: pipe,
};
