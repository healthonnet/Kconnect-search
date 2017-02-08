'use strict';

app.filter('spanWord', function($sce) {
  return function(input, word) {
    var regex = new RegExp('((' + word + ')($|[ ]))', 'gi');
    input = input.replace(regex, '<span>$1</span>');
    return $sce.trustAsHtml(input);
  };
});
