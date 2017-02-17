'use strict';

app.factory('QuestionsService', function($http, QUESTIONS_SERVICE_URL) {
  return {
    getQuestions: function(query, lang) {
      return $http.get(QUESTIONS_SERVICE_URL, {
        params: {
          language: lang,
          q: query,
          max: 5,
        },
      });
    },
  };
});
