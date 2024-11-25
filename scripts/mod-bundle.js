const fs = require("fs");
const { rollup } = require("rollup");
const { prependRoot } = require("./config.js");
const { is } = require("./utils.js");

const rollupReactResolvePlugin = ({ isProduction } = {}) => {
  const isReact = is("react.js");
  const isReactDom = is("react-dom.js");

  const react = (isProduction) =>
    isProduction ? "vendors/react/prod/react.js" : "vendors/react/react.js";

  const reactDom = (isProduction) =>
    isProduction
      ? "vendors/react/prod/react-dom.js"
      : "vendors/react/react-dom.js";

  return {
    name: "scripts/rollup-react-resolve-plugin",
    resolveId(x, importer) {
      if (isReact(x)) {
        return prependRoot(react(isProduction));
      }
      if (isReactDom(x)) {
        return prependRoot(reactDom(isProduction));
      }
      return null;
    },
  };
};

const inputOptions = {};

const outputOptions = {
  format: "iife",
  extend: false,
  interop: true,
  sourcemap: false,
};

const bundle = async ({ isProduction }) => {
  const bundle = await rollup({
    ...inputOptions,
    input: prependRoot("src/index.js"),
    plugins: [rollupReactResolvePlugin({ isProduction })],
  });

  const { output } = await bundle.generate({ ...outputOptions });
  await bundle.close();

  fs.writeFileSync(prependRoot("src/index.js"), output[0].code);
};

module.exports = {
  bundle,
};
