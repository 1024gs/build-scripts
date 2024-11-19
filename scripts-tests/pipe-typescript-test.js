const { typescript } = require("../scripts/pipe-typescript.js");

describe("typescript(options) => ({ fileName, content })", () => {
  it("transpiles the content (ts)", async () => {
    const pipe = typescript();
    const fileName = "scripts-tests/utils-test-mock/foo.ts";
    const content = "const x: number = 1;";
    const response = await pipe({ fileName, content });
    expect(response).toEqual({
      fileName,
      content: '"use strict";\nconst x = 1;\n',
    });
  });
});
