'use strict';

app.factory('TranslationService', function($http, TRANSLATION_SERVICE_URL) {
  return {
    translate: function(text, sourceLang, targetLang) {
      return $http.get(TRANSLATION_SERVICE_URL, {
        params: {
          text: text,
          sourceLang: sourceLang,
          targetLang: targetLang,
          alignmentInfo:true,
        },
      });
    },
  };
});
