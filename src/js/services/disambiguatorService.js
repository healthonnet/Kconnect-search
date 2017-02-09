'use strict';

app.factory('DisambiguatorService', function($http, DISAMBIGUATOR_SERVICE_URL) {

  return {
    getFatheadContent: function(query) {
      return $http.get(DISAMBIGUATOR_SERVICE_URL, {
        params: {
          q: query,
        },
      });
    }
  };
});
