fuzzymap
=========

Fuzzy mapping for string replacement.

## Installation
Via [npm](http://github.com/isaacs/npm)

  $ npm install fuzzymap

## Run the tests

  $ make test

## Map Syntax
Making a map is as simple as making a hash:
 - ___key___: is the string you want returned
 - ___value___: is a string, regular expression, or an array containg strings and/or regular expressions.

Sample map making:

    var fuzzymap = require('fuzzymap');
    var mapper = fuzzymapper.defineMap({
        'Grettings': /hello/ig,
        'Goodbye': "bye",
        'No Cursing!': ["fcuk", /sh[ia]t?/, "avada kedavra"]
    });

    mapper.map("HELLO, guv'na!");     //returns 'Greetings'
    mapper.map("goodbyeee nurse!");   //returns 'Goodbye'
    mapper.map("I like fcuk brand");  //returns 'No Cursing!'
    mapper.map("That is some shi'");  //returns 'No Cursing!'

The mapper will search the map until it makes a match, and returns the first match it makes.

## Methods
### Fuzzymap.defineMap(map)
This takes a map and returns to you a new mapper object;
Each time you call it you get a new Mapper object.

### Mapper.map("string")
Once you've created a Mapper, you can submit strings to test against your map.
The mapper will walk to map until it finds a match, then return it immediately.
If no matches are made, it returns the string supplied;

    var fuzzymap = require('fuzzymap');
    var mapper = fuzzymap.defineMap({
        'Name': [ /NAME/, "Username" ]
    });

    mapper.map("MY NAME IS EARL!");             //returns 'Name'
    mapper.map("Please enter your Username:");  //returns 'Name'
    mapper.map("named pair");                   //returns 'named pair'

This makes sure you should always get a value back.
This is true with null or empty maps as well.

    var fuzzymap = require('fuzzymap');
  
    fuzzymap.defineMap(null).map("data in");    //returns 'data in'
    fuzzymap.defineMap({}).map("string out");   //returns 'string out'
  
### Mapper.Map()
Returns to you the map object you passed in when creating the mapper.

### Mapper.last()
Returns the last result from Mapper.map() being called.
Defaults to null.

    var fuzzymap = require('fuzzymap');
    var mapper = fuzzymap.defineMap({
        'Name': /name/i
    });

    mapper.last();          //returns null
    mapper.map("Username"); //returns 'Name'
    mapper.last();          //returns 'Name'

## Usage
### Simple Mappings
This style is useful for when maps are simple and you're not worried about collisions.

    var fuzzymap = require('fuzzymap');

    var simpleMap = {
        AuthorName: [/author/, /author_?name/i],
        PIN: ["personal identification number", /pin/i, /p\.i\.n\./i]
    };

    var mapper = fuzzymap.defineMap(simpleMap);
    mapper.map("author's name"); //returns 'AuthorName'
    mapper.map("AUTHORNAME");    //returns 'AuthorName'
    mapper.map("pin number");    //returns 'PIN'
    mapper.map("P.I.N. number"); //returns 'PIN'
    mapper.map("something new"); //returns 'something new'

Mapper will walk the map (in no particular order) until a match is made or it runs out of options.

### Ordered Maps
There are times when the order that map tries to execute matters.
For example, the following makes this user unhappy:

    var badMap = {
        UNHAPPY: /happy/,
        HAPPY:   /happy/
    };

    var mapper = fuzzymap.defineMap(badMap);
    mapper.map("happy");        //returns 'HAPPY' or 'UNHAPPY'
    mapper.map("unhappy time"); //returns 'HAPPY' or 'UNHAPPY'

    //Since hashes are inherently unorderd, we can't ensure the right mapping is made!
    //Having ordered map groups solves this for us:

    var goodMap = [
        { UNHAPPY: /happy/ },
        { HAPPY:   /happy/ }
    ];

    var mapper = fuzzymap.defineMap(goodMap);
    mapper.map("happy");        //returns 'UNHAPPY'
    mapper.map("unhappy time"); //returns 'UNHAPPY'

### Object Mapping
This style is useful for shallow mapping the keys of objects.
Unmapped keys are passed through unaltered.

    var fuzzymap = require('fuzzymap');

    var objectMap = {
        AuthorName: [/author/, /author_?name/i],
        PIN: ["personal identification number", /pin/i, /p\.i\.n\./i]
    };

    var object = {
        author: "George R. R. Martin",
        pin: 12345,
        raw: 'value'
    };

    var mapper = fuzzymap.defineMap(objectMap);
    var result = mapper.map(object);
    
    /**
      * result == {
      *   AuthorName: 'George R. R. Martin',
      *   PIN: 12345,
      *   raw: 'value'
      * };
      *
      * result === object is true
      */

### Extract Mapped Keys
This style is useful for shallow mapping the keys of objects into a new object.
Unmapped keys are excluded from the results; default mapped keys are null.

    var fuzzymap = require('fuzzymap');

    var objectMap = {
        AuthorName: [/author/, /author_?name/i],
        PIN: ["personal identification number", /pin/i, /p\.i\.n\./i]
    };

    var object = {
        author: "George R. R. Martin",
    };

    var mapper = fuzzymap.defineMap(objectMap);
    var result = mapper.extract(object);
    
    /**
      * result == {
      *   AuthorName: 'George R. R. Martin',
      *   PIN: null
      * };
      *
      * result === object is false
      */

## License
Released under the [MIT license](http://www.opensource.org/licenses/MIT).
