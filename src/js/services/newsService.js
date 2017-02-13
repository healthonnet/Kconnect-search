'use strict';

app.factory('NewsService', function($http, NEWS_SERVICE_URL) {
  return {
    getNews: function(query) {
      return $http.get(NEWS_SERVICE_URL, {
        params: {
          q: query,
          count: 15,
        },
      });
    },
  };
});
