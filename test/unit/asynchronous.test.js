/**
 * Dependencies
 */

var Fuzzymap = require("../../fuzzymap");

/**
 * Fuzzymap Test - Asynchronous
 */
describe("When working with fuzzymap asynchronously", function() {
  it("should display the map with #Map", function(done) {
    Fuzzymap.defineMap({some_map: /some_regex/}, function(err, result) {
      expect(err).to.be(null);
      expect(result.Map()).to.eql({some_map: /some_regex/});
      done();
    });
  });

  it("should be able to access the #last", function(done) {
    Fuzzymap.defineMap({new_name: /name/}, function(err, result) {
      expect(err).to.be(null);
      expect(result.map("identity")).to.equal("identity");
      expect(result.last()).to.equal("identity");
      expect(result.map("name")).to.equal("new_name");
      expect(result.last()).to.equal("new_name");
      done();
    });
  });

  describe("when using it with a basic object map", function() { 
    it("should return test identity when given empty map object", function(done) {
      Fuzzymap.defineMap({}, function(err, result) {
        expect(err).to.be(null);
        expect(result.hasOwnProperty("map")).to.be(true);
        expect(result.map("random")).to.equal("random");
        done();
      });
    });

    it("should return test identity when given null map object", function(done) {
      Fuzzymap.defineMap(null, function(err, result) {
        expect(err).to.be(null);
        expect(result.hasOwnProperty("map")).to.be(true);
        expect(result.map("random")).to.equal("random");
        done();
      });
    });
    
    it("should work with a basic map given", function(done) {
      Fuzzymap.defineMap({new_name: [/name/]}, function(err, result) {
        expect(err).to.be(null);
        expect(result.map("name")).to.equal("new_name");
        expect(result.map("identity")).to.equal("identity");
        done();
      });
    });

    it("should work with a basic map given as value", function(done) {
      Fuzzymap.defineMap({new_name: /name/}, function(err, result) {
        expect(err).to.be(null);
        expect(result.map("name")).to.equal("new_name");
        expect(result.map("identity")).to.equal("identity");
        done();
      });
    });

    it("should return unique mappers when #defineMap called", function(done) {
      Fuzzymap.defineMap({new_name: /name/}, function(err, mapper1) {
        expect(err).to.be(null);
        Fuzzymap.defineMap({something_else: /garbage/}, function(err, mapper2) {
          expect(err).to.be(null);
          expect(mapper1.map("name")).to.equal("new_name");
          expect(mapper1.map("garbage")).to.equal("garbage");
          expect(mapper2.map("name")).to.equal("name");
          expect(mapper2.map("garbage")).to.equal("something_else");
          done();
        });
      });
    });

    it("should work with simple string maps", function(done) {
      Fuzzymap.defineMap({new_name: "MATCH_me_ExAcTlY"}, function(err, result) {
        expect(err).to.be(null);
        expect(result.map("MATCH_me_ExAcTlY")).to.equal("new_name");
        expect(result.map("match_me_exactly")).to.equal("match_me_exactly");
        done();
      });
    });

    it("should work with more than one mapping", function(done) {
      var map = {
        new_name: "name",
        new_greeting: [/happy/, /hello/i]
      };
      Fuzzymap.defineMap(map, function(err, result) {
        expect(err).to.be(null);
        expect(result.map('identity')).to.equal('identity');
        expect(result.map('name')).to.equal('new_name');
        expect(result.map('NAME')).to.equal('NAME');
        expect(result.map('happy')).to.equal('new_greeting');
        expect(result.map('hello')).to.equal('new_greeting');
        expect(result.map('HELLO')).to.equal('new_greeting');
        done();
      });
    });
  });

  describe("when working with a complex map", function() {
    it("should care about order of mapping", function(done) {
      var map = [
        { something_id: /something_?id/i },
        { something_name: /something/ }
      ];
      Fuzzymap.defineMap(map, function(err, result) {
        expect(err).to.be(null);
        expect(result.map("something")).to.equal('something_name');
        expect(result.map("somethingID")).to.equal('something_id');
        expect(result.map("something_identification_number")).to.equal('something_id');
        done();
      });
    })
  });
});
