'use strict';

app.factory('ImageService', function($http, SELECT_SERVICE_URL) {

  return {
    getImageResults: function(query, lang, rows, page) {
      if (!lang) {
        lang = 'en';
      }
      if (!rows) {
        rows = 4;
      }

      return $http.get(SELECT_SERVICE_URL, {
        params: {
          fq: 'docType:image',
          wt: 'json',
          indent: 'off',
          docType: 'image',
          group: true,
          'group.field': 'contentMD5',
          searchLanguage: lang,
          rows: rows,
          start: page * rows,
          q: parseMore(query),
        },
      });
    }
  };
});

function parseMore(query) {
  return query.replace(/\?/g, '\\?');
}
