'use strict';

app.controller('SearchController',
  ['$scope', '$location', 'ResultsService', 'SuggestionsService',
  'TrustabilityService', 'ScreenshotService',
  'DisambiguatorService', 'TranslationService',
  function($scope, $location, resultsService, suggestionsService,
    trustabilityService, screenshotService,
    disambiguatorService, translationService) {
    $scope.pageTitle = 'Search';
    $scope.pageIcon = 'fa-globe';
    $scope.pageTitleColor = 'text-dark-blue';
    $scope.form = {};
    $scope.translatedQueries = {};
    $scope.targetLang = $scope.kConfig.lang;
    $scope.searchActive = true;
    $scope.filters = $scope.filters || {};
    $scope.filters = deserialize($location.search().filters);
    $scope.$emit('searchActive');

    $scope.submit = function(targetlang) {
      if ($scope.form.param !== undefined) {
        // Prevent useless submit (same request)
        if ($scope.form.param === $location.search().q && !targetlang) {
          return;
        }

        $location.search('q', $scope.form.param);
        $location.search('lang', targetlang);

        if ($scope.translatedQueries[targetlang]) {
          $location.search('translated', $scope.translatedQueries[targetlang]);
        }

        if (targetlang === $scope.kConfig.lang || !targetlang) {
          $location.search('lang', null);
          $location.search('translated', null);
        }

      }
    };

    $scope.activateFilter = function(filter) {
      $scope.filters[filter] = !$scope.filters[filter];
      $location.search('filters', serialize($scope.filters));
    };

    $scope.searchSection = function(param) {
      if (param) {
        $location.search('section', param.toLowerCase());
      } else {
        $location.search('section', null);
      }
    };

    $scope.showScreenshot = function($index) {
      if ($index === undefined) {
        $scope.screenshot = undefined;
        return;
      }
      $scope.screenshot = $scope.results.groups[$index].doclist.docs[0];
      $scope.screenshot.preview =
        screenshotService.getScreenSrcFromUrl($scope.screenshot.url);
    };

    $scope.getSuggestion = function(val, lang = 'en') {
      if (val.length < 3) {return;}

      var array = [];
      return suggestionsService.getSpellcheck(val, lang)
        .then(function(res) {
          array = array.concat(cureSpellcheck(res.data));
          return suggestionsService.getSuggestions(val, lang);
        })
        .then(function(res) {
          array = array.concat(res.data.suggestions);
          return suggestionsService.getQuestions(val, lang);
        })
        .then(function(res) {
          array = array.concat(res.data);
          return array;
        });
    };

    $scope.handleResults = function() {

    };

    var q = $location.search().q;
    var section = $location.search().section;
    var filters = $location.search().filters;
    var translated = $location.search().translated;
    $scope.targetLang = $location.search().lang;
    var allowTranslate = ($scope.targetLang && translated);

    if (q) {
      // By default use User language.

      var queryLanguage = $scope.kConfig.lang;
      $scope.form.param = q;
      $scope.param = q;
      $scope.highlight = $scope.param;
      $scope.getColor = getColor;

      if ($scope.lang.translatableTargets) {
        translationService.translateMany(q, $scope.kConfig.lang,
          $scope.lang.translatableTargets)
          .then(function(data) {
            data.forEach(function(langTargetResponse) {
              var key = langTargetResponse.config.params.targetLang;
              var translation =
                langTargetResponse.data.translation[0].translated[0].text;
              $scope.translatedQueries[key] = translation;
            });
          });
      }

      disambiguatorService.getFatheadContent(q)
        .then(function(res) {
          if (!res.data.results[0]) { return; }

          $scope.fathead = {
            type: 'definition',
            title: q,
            content: res.data.results[0].definition,
          };

          if (allowTranslate) {
            // Translate fathead
            translationService.translate(
              $scope.fathead.content, $scope.kConfig.lang, $scope.targetLang)
              .then(function(data) {
                $scope.fathead.content =
                    data.data.translation[0].translated[0].text;
              });
          }
        });

      // Translated content request
      if (allowTranslate) {
        queryLanguage = $scope.targetLang;
        q = translated;
        $scope.highlight = translated;
      }

      // TODO Pagination
      resultsService.getResults({
        query: q,
        lang: queryLanguage,
        rows: 10,
        page: $scope.page,
        section: section,
        filters: filters,
      })
        .then(function(res) {
          // Sections
          $scope.all = 'all';
          if (section) {
            $scope.all = section.toUpperCase();
          }
          $scope.sections = res.data.facet_counts
            .facet_fields.khresmoi_sections_sectionType_facet;

          // Results
          $scope.results = res.data.grouped.domain;

          // Certification
          $scope.results.groups.forEach(function(link) {
            // Handle extra datas and mutators
            // Region free title
            link.doclist.docs[0].title =
                link.doclist.docs[0]['title_' + queryLanguage];

            // HonCode certification
            link.doclist.docs[0].isCertified = false;
            if (link.doclist.docs[0].is_certified_facet) {
              if (link.doclist.docs[0].is_certified_facet[0] === 'true') {
                link.doclist.docs[0].certified = true;
              }
            }

            // Readability
            var diff = link.doclist.docs[0].readability_difficult_facet;
            var easy = link.doclist.docs[0].readability_easy_facet;
            if (easy && diff) {
              link.doclist.docs[0].readability = 60;
            } else if (easy) {
              link.doclist.docs[0].readability = 90;
            } else if (diff) {
              link.doclist.docs[0].readability = 30;
            } else {
              link.doclist.docs[0].readability = 0;
            }

            // Trustability
            trustabilityService.getTrustabilityValueFromHost(link.groupValue)
              .then(function(data) {
                link.doclist.docs[0].trustability = data;
              });
          });
        });
    } else {
      $scope.card = mockCard;
    }
  },]);

function serialize(obj) {
  var results = '';
  for (var key in obj) {
    if (obj.hasOwnProperty(key) && obj[key]) {
      results += key + ' ';
    }
  }
  results = results.trim();
  if (results === '') {
    results = null;
  }
  return results;
}

function deserialize(text) {
  var results = {};
  if (!text) {
    return results;
  }
  var array = text.split(' ');
  for (var i = 0; i < array.length; i++) {
    results[array[i]] = true;
  }
  return results;
}

var getColor = function(normalizedValue) {
  if (normalizedValue < 33) {
    return '#fd0000';
  }
  if (normalizedValue < 66) {
    return '#fdef00';
  }
  return '#00dd00';
};

var cureSpellcheck = function(res) {
  var array = [];
  var length = res.spellcheck.suggestions.length;
  length = length > 5 ? 5 : length;
  for (var i = 0; i < 4; i++) {
    array.push(res.spellcheck.suggestions[i][1][0][1].replace(
      /spellcheck_\w\w:"([^\"]+)"/gi,'$1'
    ));
  }
  return array;
};

var mockCard = {
  url: 'views/partials/card.html',
  title: 'Benefits',
  text: 'Not for profit | No <span>ads</span> | ' +
    'No <span>cookies</span><br />' +
    'Lookup our <a href="/privacy">Privacy Policies</a>',
};
