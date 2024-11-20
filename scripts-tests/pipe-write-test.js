const fs = require("fs");
jest.spyOn(fs, "writeFileSync");
fs.writeFileSync.mockImplementation(jest.fn());

const { write } = require("../scripts/pipe-write.js");

describe("write({ destination }) => ({ fileName, content })", () => {
  it("writes the content to the destination", async () => {
    const writePipe = write({ destination: () => "foo.js" });
    const fileName = "foo.ts";
    const content = "const x = 1;";
    const response = await writePipe({ fileName, content });
    expect(response).toEqual({ fileName, content });
    expect(fs.writeFileSync).toHaveBeenCalledWith("foo.js", content);
  });
});
