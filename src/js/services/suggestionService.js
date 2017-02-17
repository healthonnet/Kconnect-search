'use strict';

app.factory('SuggestionService', function($http, SUGGEST_SERVICE_URL) {
  return {
    getSuggestion: function(val) {
      return $http.get(SUGGEST_SERVICE_URL, {
        params: {
          wt: 'json',
          q: val,
          lang: 'en',
          max: 10,
        },
      });
    },
  };
});
