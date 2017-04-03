'use strict';

app.filter('encodeURI', function() {
  return function(input) {
    return encodeURIComponent(input);
  };
});
