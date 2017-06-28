'use strict';

app.factory('SuggestionsService',
  function($http, SUGGEST_SERVICE_URL, AUTOCORRECT_SERVICE_URL,
    SPELLCHECK_SERVICE_URL, QUESTIONS_SERVICE_URL,
    TYPEAHEAD_SERVICE_URL, MAXIMUM_FREQUENCY_RATIO) {
  return {
    getSuggestions: function(query, lang) {
      if (!lang) {
        lang = 'en';
      }
      return $http.get(SUGGEST_SERVICE_URL, {
        params: {
          wt: 'json',
          q: query,
          lang: lang,
          max: 5,
        },
      });
    },

    getQuestions: function(query, lang) {
      if (!lang) {
        lang = 'en';
      }
      return $http.get(QUESTIONS_SERVICE_URL, {
        params: {
          language: lang,
          q: query,
          max: 5,
        },
      });
    },

    getSpellcheck: function(query, lang) {
      if (!lang) {
        lang = 'en';
      }
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

    getAutocorrect: function(query, lang) {
      if (!lang) {
        lang = 'en';
      }
      return $http.get(AUTOCORRECT_SERVICE_URL, {
        params: {
          wt: 'json',
          echoParams: 'explicit',
          indent: 'off',
          q: query,
          'spellcheck.dictionary': lang,
          'spellcheck.extendedResults': true,
          'spellcheck.count': 25,
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

    cureAutocorrect: function(query, response) {
      var finalSuggestions = {};
      if (
        !(response && response.spellcheck && response.spellcheck.suggestions)
      ) {
        return null;
      }

      var suggestions = response.spellcheck.suggestions;

      if (suggestions instanceof Array) {
        var tmp = {};
        for (var i = 0; i < suggestions.length; i += 2) {
          tmp[suggestions[i]] = suggestions[i + 1];
        }
        suggestions = tmp;
      }

      for (var word in suggestions) {
        if (suggestions.hasOwnProperty(word)) {

          if (word === 'collation' || word === 'correctlySpelled') {
            continue;
          }

          if (suggestions[word].suggestion.length >= 1) {

            // Only use the first suggestion
            var suggestion = suggestions[word].suggestion[0];

            if (response.responseHeader.params['spellcheck.extendedResults']) {
              // Check the extended results
              var frequencyRatio =
                suggestions[word].origFreq * (1.0 / suggestion.freq);

              if (frequencyRatio <= MAXIMUM_FREQUENCY_RATIO) {
                // Only include if the frequency ratio is low enough
                finalSuggestions[word] = [ suggestion.word ];
              }
            } else {
              finalSuggestions[word] = [ suggestion.word ];
            }
          }
        }
      }

      var size = 0;
      for (var element in finalSuggestions) {
        if (finalSuggestions.hasOwnProperty(element)) {
          size++;
        }
      }

      if (size > 0) {
        // Handle suggestion

        // Glue all the suggested words together
        var replacePairs = {};
        for (var thisWord in finalSuggestions) {
          if (finalSuggestions.hasOwnProperty(thisWord)) {
            replacePairs[thisWord] = finalSuggestions[thisWord][0];
          }
        }

        var mySuggestion = strtr(query, replacePairs);

        // Display them
        if (
          mySuggestion &&
          !equalsIgnoreCase(
            trim(query),
            trim(mySuggestion)
          )
        ) {
          return mySuggestion;
        }
        return null;
      }
    },

    getSubjects: function(query) {
      if (!query) { query = ''; }

      return $http.get(TYPEAHEAD_SERVICE_URL + '/subject', {
        params: {
          q: query,
        },
      }).then(function(res) {
        return parseSuggestions(res.data.results);
      });
    },

    getPredicates: function(query, subjectUrl) {
      if (!query) { query = ''; }
      return $http.get(TYPEAHEAD_SERVICE_URL + '/predicate', {
        paramSerializer: customHttpParamSerializer,
        params: {
          subject: subjectUrl,
          q: query,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      }).then(function(res) {
        return parseSuggestions(res.data.results);
      });
    },

    getObjects: function(query, subjectUrl, predicateUrl) {
      if (!query) { query = ''; }

      return $http.get(TYPEAHEAD_SERVICE_URL + '/object', {
        params: {
          subject: subjectUrl,
          predicate: predicateUrl,
          q: query,
        },
      }).then(function(res) {
        return parseSuggestions(res.data.results);
      });
    },

  };
});

function strtr(str, replacePairs) {
  for (var from in replacePairs) {
    if (replacePairs.hasOwnProperty(from)) {
      str = str.replace(new RegExp(from, 'g'), replacePairs[from]);
    }
  }
  return str;
}

function trim(str) {
  return !str ? str : str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function equalsIgnoreCase(first, second) {
  if (!first) {
    return !second;
  }
  if (!second) {
    return false;
  }

  return first.toUpperCase() === second.toUpperCase();
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
  return encodeURIComponent(val);
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

function parseSuggestions(fields) {
  return fields.map(function(field) {
    return {
      uri: field.uri.namespace +
      field.uri.localName,
      label: field.label,
    };
  });
}