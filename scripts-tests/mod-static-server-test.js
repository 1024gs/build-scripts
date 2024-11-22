const http = require("http");
const path = require("path");

const {
  staticServer,
  filePath,
  find,
  red,
  appendIndex,
} = require("../scripts/mod-static-server.js");

/*
* Given: expose = {path: /src, as: /x}
*        url = /x/foo.js

* Required: the file `/src/foo.js` to be available at the given url

* Solution: We could remove prefix `/x` from url
*           removePrefix(/x, /x/foo.js) -> /foo.js
*/

describe("filePath(root, exposeAs, url)", () => {
  let pathSpy;
  beforeEach(() => {
    pathSpy = jest.spyOn(path, "join").mockImplementation((a, b) => a + b);
  });

  afterEach(() => {
    pathSpy.mockRestore();
  });
  it("resolves the file path", () => {
    expect(filePath("/src", "/x", "/x/foo.js")).toBe("/src/foo.js");
    expect(filePath("/src", "/", "/x/foo.js")).toBe("/src/x/foo.js");
  });

  it("exposeAs can be undefined", () => {
    expect(filePath("/src", undefined, "/x/foo.js")).toBe("/src/x/foo.js");
  });

  it("returns null if url is invalid", () => {
    expect(filePath("/src", "/x", "/non-existent/foo.js")).toBe(null);
  });
});

describe("find(expose, files, url)", () => {
  let pathSpy;
  beforeEach(() => {
    pathSpy = jest.spyOn(path, "join").mockImplementation((a, b) => a + b);
  });

  afterEach(() => {
    pathSpy.mockRestore();
  });

  const filesOnDisk = (root) => {
    const map = {
      "/a": ["/a/foo.js"],
      "/b": ["/b/bar.js", "/b/baz.js"],
      "/c": ["/c/foo.js"],
    };
    return map[root];
  };

  it("finds the file on the disk", () => {
    const expose = [
      { path: "/a", as: "/" },
      { path: "/b", as: "/" },
    ];
    expect(find(expose, filesOnDisk, "/foo.js")).toBe("/a/foo.js");
    expect(find(expose, filesOnDisk, "/bar.js")).toBe("/b/bar.js");
    expect(find(expose, filesOnDisk, "/baz.js")).toBe("/b/baz.js");
  });

  it("virtual url prefix", () => {
    const expose = [
      { path: "/a", as: "/foo" },
      { path: "/b", as: "/bar" },
    ];
    expect(find(expose, filesOnDisk, "/foo/foo.js")).toBe("/a/foo.js");
    expect(find(expose, filesOnDisk, "/bar/bar.js")).toBe("/b/bar.js");
  });

  it("multiple prefixes", () => {
    const expose = [
      { path: "/a", as: "/" },
      { path: "/a", as: "/foo" },
      { path: "/a", as: "/bar" },
    ];
    expect(find(expose, filesOnDisk, "/foo.js")).toBe("/a/foo.js");
    expect(find(expose, filesOnDisk, "/foo/foo.js")).toBe("/a/foo.js");
    expect(find(expose, filesOnDisk, "/bar/foo.js")).toBe("/a/foo.js");
  });

  it("same file name", () => {
    const expose = [
      { path: "/a", as: "/" },
      { path: "/c", as: "/foo" },
    ];
    expect(find(expose, filesOnDisk, "/foo.js")).toBe("/a/foo.js");
    expect(find(expose, filesOnDisk, "/foo/foo.js")).toBe("/c/foo.js");
  });

  it("returns null", () => {
    const expose = [{ path: "/a", as: "/" }];
    expect(find(expose, filesOnDisk, "/non-existent.js")).toBe(null);
  });

  it("as can be undefined", () => {
    const expose = [{ path: "/a" }];
    expect(find(expose, filesOnDisk, "/foo.js")).toBe("/a/foo.js");
  });
});

describe("staticServer(options)", () => {
  const httpSpy = jest.spyOn(http, "createServer");
  let consoleLogSpy;
  const createServer = (options) => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(jest.fn());
    http.createServer.mockImplementation((simulateRequest) => simulateRequest);
    const simulateRequest = staticServer({
      expose: [{ path: "scripts-tests/utils-test-mock", as: "/" }],
      ...options,
    });

    const response = {
      end: jest.fn(),
      setHeader: jest.fn(),
    };

    return { simulateRequest, response };
  };

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  afterAll(() => {
    httpSpy.mockRestore();
  });

  it("serves the file foo.js", () => {
    const { simulateRequest, response } = createServer();
    simulateRequest({ url: "http://a.b/foo.js" }, response);
    expect(response.statusCode).toBe(200);
    expect(response.setHeader.mock.calls[0][0]).toBe("Content-Type");
    expect(response.setHeader.mock.calls[0][1]).toBe("text/javascript");
    expect(response.end.mock.calls[0][0]).toBe("const x = 1;\n");
  });

  it("serves the nested file bar.css", () => {
    const { simulateRequest, response } = createServer();
    simulateRequest({ url: "http://a.b/directory/bar.css" }, response);
    expect(response.statusCode).toBe(200);
    expect(response.setHeader.mock.calls[0][0]).toBe("Content-Type");
    expect(response.setHeader.mock.calls[0][1]).toBe("text/css");
    expect(response.end.mock.calls[0][0]).toBe("b {\n  color: black;\n}\n");
  });

  it("serves the file exposed at the virtual url /foo", () => {
    const { simulateRequest, response } = createServer({
      expose: [{ path: "scripts-tests/utils-test-mock", as: "/foo" }],
    });
    simulateRequest({ url: "http://a.b/foo/foo.js" }, response);
    expect(response.statusCode).toBe(200);
    expect(response.setHeader.mock.calls[0][0]).toBe("Content-Type");
    expect(response.setHeader.mock.calls[0][1]).toBe("text/javascript");
    expect(response.end.mock.calls[0][0]).toBe("const x = 1;\n");
  });

  it("serves index.html automatically", () => {
    const { simulateRequest, response } = createServer();
    simulateRequest({ url: "http://a.b" }, response);
    expect(response.statusCode).toBe(200);
    expect(response.setHeader.mock.calls[0][0]).toBe("Content-Type");
    expect(response.setHeader.mock.calls[0][1]).toBe("text/html");
    expect(response.end.mock.calls[0][0]).toBe("Hello World!\n");
  });

  it("index can be overrode", () => {
    const { simulateRequest, response } = createServer({ index: "foo.js" });
    simulateRequest({ url: "http://a.b" }, response);
    expect(response.statusCode).toBe(200);
    expect(response.setHeader.mock.calls[0][0]).toBe("Content-Type");
    expect(response.setHeader.mock.calls[0][1]).toBe("text/javascript");
    expect(response.end.mock.calls[0][0]).toBe("const x = 1;\n");
  });

  it("returns 404 not found", () => {
    const { simulateRequest, response } = createServer();
    simulateRequest({ url: "http://a.b/non-existent-url" }, response);
    expect(response.statusCode).toBe(404);
    expect(response.end.mock.calls[0][0]).toBe("Not Found: /non-existent-url");
  });

  it("returns 500 failed to read the file", () => {
    const { simulateRequest, response } = createServer({
      resolve: () => "this-will-throw-an-error",
    });
    simulateRequest({ url: "http://a.b/foo.js" }, response);
    expect(response.statusCode).toBe(500);
    expect(response.end.mock.calls[0][0]).toBe(
      "FAILED TO READ THE FILE: /foo.js",
    );
  });

  it("content type defaults to text/plain", () => {
    const { simulateRequest, response } = createServer();
    simulateRequest({ url: "http://a.b/foo.ts" }, response);
    expect(response.setHeader.mock.calls[0][0]).toBe("Content-Type");
    expect(response.setHeader.mock.calls[0][1]).toBe("text/plain");
  });

  it("works with cache disabled", () => {
    const { simulateRequest, response } = createServer({ cache: false });
    simulateRequest({ url: "http://a.b/foo.js" }, response);
    expect(response.statusCode).toBe(200);
    expect(response.setHeader.mock.calls[0][0]).toBe("Content-Type");
    expect(response.setHeader.mock.calls[0][1]).toBe("text/javascript");
    expect(response.end.mock.calls[0][0]).toBe("const x = 1;\n");
  });

  it("not found log", () => {
    const { simulateRequest, response } = createServer({
      expose: [
        { path: "scripts-tests/utils-test-mock", as: "/" },
        { path: "scripts-tests/utils-test-mock", as: "/foo" },
      ],
    });
    simulateRequest({ url: "http://a.b/foo/non-existent-url.js" }, response);
    expect(console.log).toHaveBeenCalledWith(
      `${red("NONE WAS FOUND:")}\n` +
        `   scripts-tests${path.sep}utils-test-mock${path.sep}foo${path.sep}non-existent-url.js\n` +
        `   scripts-tests${path.sep}utils-test-mock${path.sep}non-existent-url.js`,
    );
  });

  it("verbose", () => {
    const { simulateRequest, response } = createServer({ verbose: true });
    simulateRequest({ url: "http://a.b/foo.js", method: "GET" }, response);
    expect(console.log).toHaveBeenCalledWith("\x1B[36mGET\x1B[0m /foo.js");
  });
});

describe("appendIndex()", () => {
  it("appends index.html", () => {
    expect(appendIndex("index.html", "foo")).toBe("foo/index.html");
    expect(appendIndex("/index.html", "foo")).toBe("foo/index.html");
    expect(appendIndex("index.html", "foo/")).toBe("foo/index.html");
    expect(appendIndex("/index.html", "foo/")).toBe("foo/index.html");
  });
});
