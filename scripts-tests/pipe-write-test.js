const fs = require('fs');
jest.spyOn(fs, "writeFile");

const {write} = require('../scripts/pipe-write.js');

describe('write({ destination }) => ({ fileName, content })', () => {
    it('writes the content to the destination', async () => {
        fs.writeFile.mockImplementation((fileName, content, x, callback) => {
            callback();
        });
        const pipe = write({destination: () => 'foo.js'});
        const fileName = 'foo.ts';
        const content = 'const x = 1;'
        const response = await pipe({fileName, content})
        expect(response).toEqual({fileName, content})
        expect(fs.writeFile).toHaveBeenCalledWith('foo.js', content, 'utf8', expect.anything());
    })
})