'use strict';

app.factory('TranslationService', function($http, TRANSLATION_SERVICE_URL, $q) {
  return {
    translate: function(text, sourceLang, targetLang) {
      return $q(function(resolve, reject) {
        $http.get(TRANSLATION_SERVICE_URL, {
          params: {
            text: text,
            sourceLang: sourceLang,
            targetLang: targetLang,
            alignmentInfo: false,
          },
        }).then(function(res) {
          var data = parseResults(res);
          resolve(data);
        }, function(error) {
          reject(error);
        });
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

function parseResults(res) {
  if (!res.data.translation) {return;}
  if (!res.data.translation[0].translated) {return;}
  var parsedData = {};
  var translatedContent = '';

  res.data.translation[0].translated.forEach(function(translatedPart, i) {
    translatedContent += translatedPart.text;
    if (res.data.translation[0].translated[i + 1]) {
      translatedContent += '\n';
    }
  });

  parsedData.lang = res.config.params.targetLang;
  parsedData.originalText = res.config.params.text;
  parsedData.translation = translatedContent;

  return parsedData;
}