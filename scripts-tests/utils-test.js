const {all} = require("../scripts/utils.js");

describe('utils', () => {

  describe('all(predicates, x)', () => {
    const greaterThan1 = (x) => (x > 1);
    const equals2 = (x) => (x === 2);
    const isEven = (x) => (x % 2 === 0);

    it('reports whether all predicates are satisfied by a given value x', () => {
      expect(all([greaterThan1, equals2, isEven], 2)).toEqual(true);
      expect(all([greaterThan1, equals2], 3)).toEqual(false);
      expect(all([greaterThan1, equals2], 0)).toEqual(false);
    });

    it('returns true for an empty predicate list', () => {
      expect(all([], 2)).toEqual(true);
    });

    it('returns a curried function', () => {
      expect(all([equals2], 2)).toEqual(true);
      expect(all([equals2])(2)).toEqual(true);
    });
  });
});
