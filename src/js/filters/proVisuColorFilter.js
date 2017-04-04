'use strict';

app.filter('proVisuColor', function() {
  return function(input) {
    switch (input) {
      case 'Black': {
        return 'black';
      }
      case 'Blue': {
        return 'blue';
      }
      case 'Cyan': {
        return 'cyan';
      }
      default: {
        return 'normal';
      }
    }
  };
});
