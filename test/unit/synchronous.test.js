/**
 * Dependencies
 */

var Fuzzymap = require("../../fuzzymap");

/**
 * Fuzzymap Test - Synchronous
 */
describe("When working with fuzzymap synchronously", function() {
  it("should display the map with #Map", function(done) {
    var result = Fuzzymap.defineMap({some_map: /some_regex/});
    expect(result.Map()).to.eql({some_map: /some_regex/});
    done();
  });

  it("should be able to access the #last", function(done) {
    var result = Fuzzymap.defineMap({new_name: /name/})
    expect(result.map("identity")).to.equal("identity");
    expect(result.last()).to.equal("identity");
    expect(result.map("name")).to.equal("new_name");
    expect(result.last()).to.equal("new_name");
    done();
  });

  describe("when using it with a basic object map", function() { 
    it("should return test identity when given empty map object", function(done) {
      var result = Fuzzymap.defineMap({});
      expect(result.hasOwnProperty("map")).to.be(true);
      expect(result.map("random")).to.equal("random");
      done();
    });

    it("should return test identity when given null map object", function(done) {
      var result = Fuzzymap.defineMap(null);
      expect(result.hasOwnProperty("map")).to.be(true);
      expect(result.map("random")).to.equal("random");
      done();
    });
    
    it("should work with a basic map given", function(done) {
      var result = Fuzzymap.defineMap({new_name: [/name/]});
      expect(result.map("name")).to.equal("new_name");
      expect(result.map("identity")).to.equal("identity");
      done();
    });

    it("should work with a basic map given as value", function(done) {
      var result = Fuzzymap.defineMap({new_name: /name/});
      expect(result.map("name")).to.equal("new_name");
      expect(result.map("identity")).to.equal("identity");
      done();
    });

    it("should return unique mappers when #defineMap called", function(done) {
      var mapper1 = Fuzzymap.defineMap({new_name: /name/});
      var mapper2 = Fuzzymap.defineMap({something_else: /garbage/});
      expect(mapper1.map("name")).to.equal("new_name");
      expect(mapper1.map("garbage")).to.equal("garbage");
      expect(mapper2.map("name")).to.equal("name");
      expect(mapper2.map("garbage")).to.equal("something_else");
      done();
    });

    it("should work with simple string maps", function(done) {
      var result = Fuzzymap.defineMap({new_name: "MATCH_me_ExAcTlY"});
      expect(result.map("MATCH_me_ExAcTlY")).to.equal("new_name");
      expect(result.map("match_me_exactly")).to.equal("match_me_exactly");
      done();
    });

    it("should work with more than one mapping", function(done) {
      var map = {
        new_name: "name",
        new_greeting: [/happy/, /hello/i]
      };
      var result = Fuzzymap.defineMap(map);
      expect(result.map('identity')).to.equal('identity');
      expect(result.map('name')).to.equal('new_name');
      expect(result.map('NAME')).to.equal('NAME');
      expect(result.map('happy')).to.equal('new_greeting');
      expect(result.map('hello')).to.equal('new_greeting');
      expect(result.map('HELLO')).to.equal('new_greeting');
      done();
    });
  });

  describe("when working with a complex map", function() {
    it("should care about order of mapping", function(done) {
      var map = [
        { something_id: /something_?id/i },
        { something_name: /something/ }
      ];
      var result = Fuzzymap.defineMap(map);
      expect(result.map("something")).to.equal('something_name');
      expect(result.map("somethingID")).to.equal('something_id');
      expect(result.map("something_identification_number")).to.equal('something_id');
      done();
    });
  });

  describe("when working with an object item", function() {
    it("should shallowly map the whole object", function(done) {
      var map = {
        gold: /lead/i,
        wine: ["water", "H20"]
      };
      var param = {
        leAD: 1,
        water: "splash",
        H20: "Ahh!",
      };
      var expected = {
        gold: 1,
        wine: "Ahh!"
      };
      
      var result = Fuzzymap.defineMap(map);
      expect(result.map(param)).to.eql(expected);
      done();
    });
  });
});
