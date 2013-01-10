/**
 * Dependencies
 */

var _ = require('underscore');

/**
 * Fuzzymap
 */

module.exports = (function() {

  var Base = {};

  Base.defineMap = function(mapObj, callback) {
    if(!_.isFunction(callback))
      return newFuzzyMap(mapObj);

    return callback(null, newFuzzyMap(mapObj));
  };

  return Base;
})();

/**
 * Private functions
 */

var newFuzzyMap = function(map) {

  var Fuzzymap = {};
  var Map = map;
  var PureMap = map;
  var LastValue = null;

  if(!_.isArray(map))
    Map = [Map]

  Fuzzymap.Map = function() {
    return PureMap;
  }

  Fuzzymap.last = function() {
    return LastValue;
  }

  Fuzzymap.map = function(item) {
    LastValue = item;
    _.find(Map, function(MapGroup) {
      return testGroup(item, MapGroup) !== false;;
    });

    return Fuzzymap.last();
  }
    
  var testGroup = function(item, MapGroup) {
    if(MapGroup === null || MapGroup === undefined)
      MapGroup = {};

    var mapped = _.find(_.keys(MapGroup), function(mapString) {
      var regexes = MapGroup[mapString];

      if(!_.isArray(regexes))
        regexes = [regexes];

      var regex = _.find(regexes, function(regex) {
        return nil(item.match(regex)) === false;
      });
      
      return nil(regex) === false;
    });

    if(!nil(mapped))
      LastValue = mapped;
    
    return nil(mapped) === false;

  };

  return Fuzzymap;
};

var nil = function(test) {
  return (test === null || test === undefined);
};

