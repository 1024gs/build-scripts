const fs = require("fs");
const liveReload = require("livereload");

const { prependRoot, removeRoot, isSassSubmodule } = require("./config.js");
const { scssSource, tsSource } = require("./config.js");
const { cssDestination, jsDestination } = require("./config.js");
const { scanDir, all, isNot, uniq } = require("./utils.js");
const { scripts, styles } = require("./tasks.js");

const watch = (fileName, listener) => {
  const options = {
    persistent: true,
    interval: 200,
    encoding: "utf8",
  };

  console.log("-- watching... ", removeRoot(fileName));
  fs.watchFile(fileName, options, (curr, prev) => {
    if (curr.mtime > prev.mtime) {
      listener(fileName);
    }
  });
};

const unwatch = (fileName) => {
  console.log("-- not watching... ", removeRoot(fileName));
  fs.unwatchFile(fileName);
};

const transpileEsAndReloadBrowser = async (fileName) => {
  unwatch(fileName);
  try {
    await scripts({ fileName });
  } catch (e) {
    console.log(e);
  }
  watch(fileName, transpileEsAndReloadBrowser);
  liveReloadServer.refresh(jsDestination(fileName));
};

const compileScssAndReloadBrowser = async (fileName) => {
  if (isSassSubmodule(fileName)) {
    const scssFiles = scssSource();
    scssFiles.map(unwatch);
    try {
      await styles();
    } catch (e) {
      console.log(e);
    }
    scssFiles.map((fileName) => watch(fileName, compileScssAndReloadBrowser));
    scssFiles.map((fileName) =>
      liveReloadServer.refresh(cssDestination(fileName))
    );
  } else {
    unwatch(fileName);
    try {
      await styles({ fileName });
    } catch (e) {
      console.log(e);
    }
    watch(fileName, compileScssAndReloadBrowser);
    liveReloadServer.refresh(cssDestination(fileName));
  }
};

/* Start the live reload server */
const liveReloadServer = liveReload.createServer();

/* Watch ts */
const tsFiles = tsSource().filter(all([isNot("test.ts"), isNot("test.tsx")]));
tsFiles.map((fileName) => watch(fileName, transpileEsAndReloadBrowser));

/* Watch scss */
const scssFiles = uniq([
  ...scssSource(),
  ...scanDir(prependRoot("src")).filter(isSassSubmodule),
]);
scssFiles.map((fileName) => watch(fileName, compileScssAndReloadBrowser));

/* Stop watching all the files and close the server */
process.on("exit", () => {
  [...tsFiles, ...scssFiles].map((fileName) => unwatch(fileName));
  liveReloadServer.close();
});
