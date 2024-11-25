const { is, any, not, test, scanDir, pipeline, source } = require("./utils");
const { read } = require("./pipe-read.js");
const { write } = require("./pipe-write.js");

const findFiles = () =>
  scanDir("dist")
    .filter(any([is(".html"), is(".js")]))
    .filter(not(test(/vendors/)));

const destination = (fileName) => fileName;

const regexFactory = (options) =>
  new RegExp(
    "([\\t ]*\\/\\* ?" +
      options.startComment +
      " ?\\*\\/)[\\s\\S]*?(\\/\\* ?" +
      options.endComment +
      " ?\\*\\/[\\t ]*\\n?)",
    "g",
  );

const stripDevCode =
  (options) =>
  ({ fileName, content }) => {
    const pattern = regexFactory({
      startComment: "start-dev-block",
      endComment: "end-dev-block",
    });

    const result = content.replace(pattern, "");

    return { fileName, content: result };
  };

const removeDevCode = pipeline([
  source({ findFiles }),
  read(),
  stripDevCode(),
  write({ destination }),
]);

module.exports = {
  removeDevCode,
};
