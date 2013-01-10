/**
 * Dependecies
 */

/**
 * Fuzzymap - General Tests
 */

describe("When working with Fuzzymap in general", function() {
  describe("it should return the base functions like", function () {
    it("#defineMap", function(done) {
      var fuzzymap = require('../../fuzzymap');
      expect(fuzzymap.hasOwnProperty('defineMap')).to.be(true);
      done();
    });
  });
});
