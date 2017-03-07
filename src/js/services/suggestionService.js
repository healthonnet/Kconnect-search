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
    cureSpellcheck: function(res) {
      var array = [];
      var length = res.spellcheck.suggestions.length;
      if (length === 0) {
        return {};
      }
      length = length > 5 ? 5 : length;
      for (var i = 0; i < 4; i++) {
        array.push(res.spellcheck.suggestions[i][1][0][1].replace(
          /spellcheck_\w\w:"([^\"]+)"/gi,'$1'
        ));
      }
      return array;
    },
  };
});
