const path = require("path");
const { babel } = require("@rollup/plugin-babel");
const { prependRoot } = require("./config.js");

const external = ["jquery", "popper.js"];
const plugins = [
  babel({
    // Include the helpers in the bundle, at most one copy of each
    babelHelpers: "bundled",
  }),
];

module.exports = {
  input: prependRoot("vendors/bootstrap/js/index.js"),
  output: {
    file: prependRoot("vendors/bootstrap/dist/js/bootstrap.js"),
    format: "iife",
    globals: { jquery: "jQuery", "popper.js": "Popper" },
    name: "bootstrap",
  },
  external,
  plugins,
};
