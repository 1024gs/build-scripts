const sass = require("node-sass");

const pipe = (options) => ({ fileName, content }) => {
  return new Promise((resolve) => {
    const result = sass.renderSync({ data: content, file: fileName });
    // const result = sass.compile()
    // const result = sass.compileString()
    resolve({ fileName, content: result.css });
  });
};

module.exports = {
  sass: pipe,
};


// const sass = require('sass');

// const result = sass.compile(scssFilename);

// // OR

// // Note that `compileAsync()` is substantially slower than `compile()`.
// const result = await sass.compileAsync(scssFilename);