const { prependRoot } = require("./config.js");
const { is, any, not } = require("./utils.js");
const staticServer = require("./mod-static-server.js");

const doesNotHaveExtension = not(
  any([
    is(".css"),
    is(".html"),
    is(".js"),
    is(".ico"),
    is(".json"),
    is(".png"),
    is(".nrrd"),
    is(".vtk"),
    is(".gzip"),
  ])
);

const resolve = (url) => {
  if (url === "/") {
    return null;
  }
  if (is(".obj", url) || is(".stl", url) || is(".ctm", url)) {
    return prependRoot(decodeURI(url));
  }
  if (doesNotHaveExtension(url)) {
    return prependRoot(url + ".js");
  }
  return null;
};

const argv = process.argv.slice(2);
const serveDist = argv[0];

const opt = serveDist
  ? { expose: [{ path: "dist", as: "/" }] }
  : {
      verbose: true,
      expose: [
        { path: "src", as: "/src" },
        { path: "src", as: "/" },
        { path: "vendors", as: "/vendors" },
        { path: "models", as: "/models" },
      ],
      resolve: resolve,
    };
const server = staticServer(opt);
const port = 8000;

server.listen(port, () => {
  console.log(`Development server is listening on port ${port}`);
});

process.on("exit", () => {
  server.close();
});
