'use strict';

app.factory('TranslationService', function($http, TRANSLATION_SERVICE_URL, $q) {
  return {
    translate: function(text, sourceLang, targetLang) {
      return $http.get(TRANSLATION_SERVICE_URL, {
        params: {
          text: text,
          sourceLang: sourceLang,
          targetLang: targetLang,
          alignmentInfo: true,
        },
      });
    },
    translateMany(text, sourceLang, targetsLang) {
      var requests = [];
      var that = this;
      targetsLang.forEach(function(targetLang) {
        requests.push(that.translate(text, sourceLang, targetLang));
      });
      return $q.all(requests);
    },
  };
});
