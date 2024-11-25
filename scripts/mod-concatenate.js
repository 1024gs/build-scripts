const fs = require("fs");
const crypto = require("crypto");
const useref = require("useref");
const { prependRoot } = require("./config");
const { mkDirR } = require("./utils");
const path = require("path");

const read = (filename) => fs.readFileSync(filename, "utf8");

const revHash = (str) =>
  crypto.createHash("md5").update(str).digest("hex").slice(0, 10);

const revRename = (ver, x) => x.replace(/(\.\w+$)/, "-" + ver + "$1");

const revReplaceFactory = (from, to) => (html) =>
  html.replace(RegExp("(=|'|\")" + from), "$1" + to);

const revReplace = (html, fns) => fns.reduce((a, fn) => fn(a), html);

const concatenate = async () => {
  const dist = prependRoot("dist");
  mkDirR(dist);

  const result = fs.readFileSync(prependRoot("src/index.html"), "utf8");

  const [html, files] = useref(result);
  const replaceFunctions = [];

  Object.keys(files).forEach((type) => {
    Object.keys(files[type]).forEach((filename) => {
      const assets = files[type][filename]["assets"];

      const assetsContent = assets
        .map(prependRoot)
        .map(read)
        .reduce((a, b) => a + b, "");

      const hash = revHash(assetsContent);
      const renamed = revRename(hash, filename);

      fs.writeFileSync(path.join(dist, renamed), assetsContent);

      replaceFunctions.push(revReplaceFactory(filename, renamed));

      console.log(renamed);
      console.log(assetsContent.length);
    });
  });

  const revHtml = revReplace(html, replaceFunctions);

  fs.writeFileSync(prependRoot("dist/index.html"), revHtml);
};

module.exports = {
  concatenate,
};
