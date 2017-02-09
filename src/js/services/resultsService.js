'use strict';

app.factory('ResultsService', function($http, SELECT_SERVICE_URL) {
  return {
    getResults: function(query, lang, rows, page) {
      if (!lang) {
        lang = 'en';
      }
      if (!rows) {
        rows = 4;
      }
      return $http.get(SELECT_SERVICE_URL, {
        params: {
          facet: true,
          fq: 'docType:html',
          indent: 'off',
          group: true,
          docType: 'html',
          'f.khresmoi_sections_sectionType_facet.facet.limit': 50,
          'f.khresmoi_sections_sectionType_facet.facet.mincount': 1,
          'facet.field': 'khresmoi_sections_sectionType_facet',
          // TODO: what?
          // 'facet.field': 'health_topics_facet',
          // 'facet.field': 'readability_difficult_facet',
          // 'facet.field': 'readability_easy_facet',
          'group.field': 'domain',
          facetsToFetch: '%20khresmoi_sections_cleanedBody_facet' +
          '%20khresmoi_sections_cleanedTitle_facet' +
          '%20khresmoi_sections_internalLink_facet' +
          '%20khresmoi_sections_sectionType_facet' +
          '%20readability_difficult_facet' +
          '%20readability_easy_facet' +
          '%20is_certified_facet',
          q: query,
          searchLanguage: 'en',
          wt: 'json',
        },
      });
    },
  };
});
