const { babel } = require("../scripts/pipe-babel.js");

describe("babel(options) => ({ fileName, content })", () => {
  it("transpiles the content", async () => {
    const pipe = babel();
    const fileName = "scripts-tests/utils-test-mock/foo.js";
    const content = "const x = `foo${1}`;";
    const response = await pipe({ fileName, content });
    expect(response).toEqual({
      fileName,
      content: 'const x = "foo".concat(1);',
    });
  });
});
