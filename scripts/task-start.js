const {
  staticServer,
  doesNotHaveExtension,
} = require("./mod-static-server.js");
const { prependRoot } = require("./config.js");

const resolve = (url) => {
  if (url === "/") {
    return null;
  }
  if (doesNotHaveExtension(url)) {
    return prependRoot(url + ".js");
  }
  return null;
};

const argv = process.argv.slice(2);
const serveDist = argv[0];

const options = serveDist
  ? { expose: [{ path: "dist", as: "/" }] }
  : {
      verbose: true,
      expose: [
        { path: "src", as: "/src" },
        { path: "src", as: "/" },
        { path: "vendors", as: "/vendors" },
      ],
      resolve,
    };
const server = staticServer(options);
const port = 8000;

server.listen(port, () => {
  console.log(`Development server is listening on port ${port}`);
});

process.on("exit", () => {
  server.close();
});
