const { autoprefixer } = require("../scripts/pipe-autoprefixer.js");

describe("autoprefixer(options) => ({ fileName, content })", () => {
  it("prefixes the content (css)", async () => {
    const pipe = autoprefixer();
    const fileName = "scripts-tests/utils-test-mock/foo.css";
    const content = "::placeholder {color: gray;}";
    const response = await pipe({ fileName, content });
    expect(response).toEqual({
      fileName,
      content:
        "::-ms-input-placeholder {color: gray;}\n::placeholder {color: gray;}",
    });
  });
});
