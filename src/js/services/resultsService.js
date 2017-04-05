'use strict';

app.factory('ResultsService',
  function($http, SELECT_SERVICE_URL, TYPEAHEAD_SERVICE_URL,
           TYPEAHEADLABEL_SERVICE_URL, MIMIR_SERVICE_URL,
           $httpParamSerializerJQLike) {
  return {
    getResults: function(options) {
      options = {
        query: options.query ? options.query : '',
        lang: options.lang ? options.lang : 'en',
        rows: options.rows ? options.rows : 4,
        start: options.page ? (options.rows * (options.page - 1)) : 0,
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
    getSemanticRequest: function(options) {
      if (!options.subject || !options.predicate || !options.object) {
        return false;
      }
      options.rows = options.rows || 4;

      return $http.get(TYPEAHEAD_SERVICE_URL + '/sparql.srj', {
        params: {
          subject: options.subject,
          predicate: options.predicate,
          object: options.object,
        },
      }).then(function(res) {
        return [
          buildMimirQuery(res.data.results),
          buildTreatmentQuery(res.data.results),
        ];
      });
    },

    executeMimirQuery: function(mimirQuery, page) {
      if (!mimirQuery) {
        return false;
      }
      return $http({
        url: MIMIR_SERVICE_URL + '/postQuery',
        method: 'POST',
        data: $httpParamSerializerJQLike({
          queryString: mimirQuery,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      }).then(function(res) {
        var xmlDoc = new DOMParser().parseFromString(res.data, 'text/xml');
        if (xmlDoc.getElementsByTagName('queryId').length > 0) {
          var queryId = xmlDoc.getElementsByTagName('queryId')[0].textContent;
          var start = page ? (10 * (page - 1)) : 0;

          return $http.get(MIMIR_SERVICE_URL + '/documentResults', {
            params: {
              queryId: queryId,
              start: start,
            },
          }).then(function(res) {
            return res.data;
          });
        }
        return false;
      });
    },

    getTreatments: function(autocompleteQuery) {
      return $http({
        url: TYPEAHEADLABEL_SERVICE_URL + '/autocomplete.json',
        method: 'POST',
        data: $httpParamSerializerJQLike({
          uri: autocompleteQuery,
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      }).then(function(res) {
        return res.data;
      });
    },
  };
});

function buildMimirQuery(results) {
  if (!results.bindings.length) {
    return false;
  }
  var mimirQuery = results.bindings.map(function(element, index) {
    return '{Lookup inst = "' + element.s.value + '"}';
  }).join(' OR ');
  mimirQuery = '(' + mimirQuery + ') IN {Publication language="en"}';
  return mimirQuery;
}

function buildTreatmentQuery(results) {
  return results.bindings.map(function(element, index) {
    return element.s.value;
  }).join(',');
}

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
