const { read } = require("../scripts/pipe-read.js");

describe("read(options) => ({ fileName })", () => {
  it("reads the file", async () => {
    const pipe = read();
    const fileName = "scripts-tests/test-mock/foo.js";
    const response = await pipe({ fileName });
    expect(response).toEqual({ fileName, content: "const x = 1;\n" });
  });
});
