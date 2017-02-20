'use strict';

app.factory('ResultsService', function($http, SELECT_SERVICE_URL) {
  return {
    getResults: function(options) {
      options = {
        query: options.query ? options.query : '',
        lang: options.lang ? options.lang : 'en',
        rows: options.rows ? options.rows : 4,
        start: options.page ? options.rows * options.page : 0,
        section: options.section ?
          'khresmoi_sections_sectionType_facet:' +
          options.section.toUpperCase() : '',
        filters: parseFilters(options.filters),
      };
      return $http.get(SELECT_SERVICE_URL, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
        params: {
          facet: true,
          indent: 'off',
          group: true,
          start: options.start,
          docType: 'html',
          'f.khresmoi_sections_sectionType_facet.facet.limit': 50,
          'f.khresmoi_sections_sectionType_facet.facet.mincount': 1,
          'facet.field': [
            'khresmoi_sections_sectionType_facet',
            'health_topics_facet',
            'readability_difficult_facet',
            'readability_easy_facet',
          ],
          'group.field': 'domain',
          facetsToFetch: ' khresmoi_sections_cleanedBody_facet' +
          ' khresmoi_sections_cleanedTitle_facet' +
          ' khresmoi_sections_internalLink_facet' +
          ' khresmoi_sections_sectionType_facet' +
          ' readability_difficult_facet' +
          ' readability_easy_facet' +
          ' is_certified_facet',
          q: parseMore(options.query),
          fq: [
            'docType:html',
            options.section,
            options.filters,
          ],
          searchLanguage: options.lang,
          wt: 'json',
        },
      });
    },
  };
});

function parseFilters(filters) {
  if (typeof filters !== 'string') {
    return '';
  }
  var filtersArray = filters.split(' ');
  filtersArray = filtersArray.map(function(s) {
    return '(hon_label_' + s + '_facet:true)';
  });
  filters = filtersArray.join(' OR ');
  return filters;
}

var customHttpParamSerializer = function(params) {
  if (!params) { return ''; }
  var parts = [];
  var value;
  for (var param in params) {
    if (params.hasOwnProperty(param)) {
      value = params[param];
      if (value === null || typeof value === undefined) { return; }
      if (Array.isArray(value)) {
        parts.concat(serializeArray(value, param));
      } else {
        parts.push(encodeUriQuery(param) + '=' +
            encodeUriQuery(serializeValue(value)));
      }
    }
  }
  return parts.join('&');
};

function encodeUriQuery(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',');
}

function serializeValue(v) {
  if (typeof v === 'object') {
    return v instanceof Date ? v.toISOString() : v;
  }
  return v;
}

function serializeArray(value, param) {
  var parts = [];
  value.forEach(function(v) {
    parts.push(encodeUriQuery(param)  + '=' +
      encodeUriQuery(serializeValue(v)));
  });
  return parts;
}

function parseMore(query) {
  return query.replace(/\?/g, '\\?');
}
