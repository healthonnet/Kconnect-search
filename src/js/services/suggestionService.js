'use strict';

app.factory('SuggestionsService',
  function($http, SUGGEST_SERVICE_URL,
    SPELLCHECK_SERVICE_URL, QUESTIONS_SERVICE_URL) {
  return {
    getSuggestions: function(query, lang = 'en') {
      return $http.get(SUGGEST_SERVICE_URL, {
        params: {
          wt: 'json',
          q: query,
          lang: lang,
          max: 5,
        },
      });
    },
    getQuestions: function(query, lang = 'en') {
      return $http.get(QUESTIONS_SERVICE_URL, {
        params: {
          language: lang,
          q: query,
          max: 5,
        },
      });
    },
    getSpellcheck: function(query, lang = 'en') {
      return $http.get(SPELLCHECK_SERVICE_URL, {
        params: {
          wt: 'json',
          q: 'spellcheck_' + lang + ':"' + query + '"',
          'spellcheck.dictionary': lang,
          omitHeader: true,
          indent: 'off',
          max: 5,
        },
      });
    },
  };
});
