'use strict';

app.filter('crop', function() {
  return function(input) {
    // TODO: have a filter removing excess repositories
    // like something.com/a/b/c/d/e/f/g/h => something.com/a/.../h
    // http://stackoverflow.com/questions/14594965
    return input;
  };
});
