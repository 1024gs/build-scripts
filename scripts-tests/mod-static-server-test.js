const serverFactory = require('../scripts/mod-static-server.js');

describe('serverFactory()', () => {
    it('is a function', () => {
        expect(typeof serverFactory).toBe('function')
    })
})