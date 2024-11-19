const {sass} = require('../scripts/pipe-sass.js');

describe('sass(options) => ({ fileName, content })', () => {
    it('compiles the content (scss)', async () => {
        const pipe = sass();
        const fileName = 'scripts-tests/utils-test-mock/foo.scss';
        const content = '$red: red !default; p {color: $red;}'
        const response = await pipe({fileName, content})
        expect(response).toEqual({fileName, content: 'p {\n  color: red;\n}'})
    })
})