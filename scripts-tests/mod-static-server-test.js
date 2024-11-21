const http = require("http");
const path = require("path");

const {
  staticServer,
  filePath,
  find,
  red,
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
    // httpSpy.mockRestore();
  });

  it("serves the file foo.js", () => {
    const { simulateRequest, response } = createServer();
    simulateRequest({ url: "http://www.mysite.com/foo.js" }, response);
    expect(response.statusCode).toBe(200);
    expect(response.setHeader.mock.calls[0][0]).toBe("Content-Type");
    expect(response.setHeader.mock.calls[0][1]).toBe("text/javascript");
    expect(response.end.mock.calls[0][0]).toBe("const x = 1;\n");
  });

  it("mime type defaults to text/plain", () => {
    const { simulateRequest, response } = createServer();
    simulateRequest({ url: "/foo.ts" }, response);
    expect(response.setHeader.mock.calls[0][1]).toBe("text/plain");
  });

  it("returns 404 Not found", () => {
    const { simulateRequest, response } = createServer();
    simulateRequest({ url: "/non-existent-url" }, response);
    expect(response.statusCode).toBe(404);
    expect(response.end.mock.calls[0][0]).toBe("Not Found: /non-existent-url");
  });

  it("returns 500 Failed to read the file", () => {
    const { simulateRequest, response } = createServer({
      resolve: () => "non-existent-file",
    });
    simulateRequest({ url: "/foo.js" }, response);
    expect(response.statusCode).toBe(500);
    expect(response.end.mock.calls[0][0]).toBe(
      "FAILED TO READ THE FILE: /foo.js",
    );
  });

  it("virtual url", () => {
    const { simulateRequest, response } = createServer({
      expose: [{ path: "scripts-tests/utils-test-mock", as: "/foo" }],
    });
    simulateRequest(
      { url: "http://www.mysite.com/foo/directory/bar.css" },
      response,
    );
    expect(response.statusCode).toBe(200);
    expect(response.setHeader.mock.calls[0][0]).toBe("Content-Type");
    expect(response.setHeader.mock.calls[0][1]).toBe("text/css");
    expect(response.end.mock.calls[0][0]).toBe("b {\n  color: black;\n}\n");
  });

  it("verbose", () => {
    const { simulateRequest, response } = createServer({
      expose: [{ path: "scripts-tests/utils-test-mock", as: "/" }],
      verbose: true,
    });
    simulateRequest({ url: "/foo.js", method: "GET" }, response);
    expect(console.log).toHaveBeenCalledWith("\x1B[36mGET\x1B[0m /foo.js");
  });
});

describe("notFoundLog(index, url)", () => {
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
    // httpSpy.mockRestore();
  });

  it("not found log", () => {
    const { simulateRequest, response } = createServer({
      expose: [
        { path: "scripts-tests/utils-test-mock", as: "/" },
        { path: "scripts-tests/utils-test-mock", as: "/foo" },
      ],
    });
    simulateRequest({ url: "/foo/non-existent-url" }, response);
    expect(console.log).toHaveBeenCalledWith(
      `${red("NONE WAS FOUND:")}` +
        `\n   scripts-tests${path.sep}utils-test-mock${path.sep}foo${path.sep}non-existent-url` +
        `\n   scripts-tests${path.sep}utils-test-mock${path.sep}non-existent-url`,
    );
  });
});
