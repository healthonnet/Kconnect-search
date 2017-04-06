'use strict';

app.controller('SearchController',
  ['$scope', '$location', '$window', 'ResultsService', 'SuggestionsService',
  'TrustabilityService', 'ScreenshotService', '$translate',
  'DisambiguatorService', 'TranslationService',
  function($scope, $location, $window, resultsService, suggestionsService,
    trustabilityService, screenshotService, $translate,
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
    $scope.highlight = undefined;
    $scope.isDefinitionCollapsed = false;
    $scope.isSmallWidth = $window.innerWidth < 768;

    angular.element($window).bind('resize', function() {
      $scope.isSmallWidth = false;
      if ($window.innerWidth < 768) {
        $scope.isSmallWidth = true;
      }
    });

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
        $scope.highlight = undefined;
        return;
      }
      $scope.highlight = $index;
      $scope.screenshot = $scope.results.groups[$index].doclist.docs[0];
      $scope.screenshot.preview =
        screenshotService.getScreenSrcFromUrl($scope.screenshot.url);
    };

    $scope.getSuggestion = function(val, lang) {
      if (!lang) {
        lang = $scope.kConfig.lang;
      }

      var array = [];
      return suggestionsService.getSpellcheck(val, lang)
        .then(function(res) {
          var results = suggestionsService.cureSpellcheck(res.data);
          if (results.length) {
            array = array.concat(results);
          }
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
              var key = langTargetResponse.lang;
              var translation =
                langTargetResponse.translation;
              $scope.translatedQueries[key] = translation;
            });
          });
      }

      disambiguatorService.getFatheadContent(q)
        .then(function(res) {
          if (!res.data.results[0]) {
            throw new Error('No fathead');
          }
          $scope.fathead = extractDefinitionFromDisambiguator(q, res.data);

          // Check if result is misspelt
          if (!$scope.fathead) {
            throw new Error('No fathead');
          }

          // Translate fathead to User language
          if ($scope.kConfig.lang !== 'en') {
            translationService.translate(
              $scope.fathead.content, 'en', $scope.kConfig.lang)
              .then(function(data) {
                $scope.fathead.content =
                    data.translation;
              });
          }

          if ($scope.fathead.content.length > 600) {
            $scope.isDefinitionCollapsed = true;
          }
        })
        .catch(err => {
          suggestionsService.getAutocorrect(q, $scope.kConfig.lang)
            .then(function(res) {
              var results = suggestionsService.cureAutocorrect(q, res.data);
              if (results) {
                $scope.fathead = {
                  type: 'views/fatheads/suggestions.html',
                  content: results,
                };
              }
              return;
            });
        });

      // Translated content request
      if (allowTranslate) {
        queryLanguage = $scope.targetLang;
        q = translated;
        $scope.translatedHighlight = translated;
      }

      // Paginated results
      resultsService.getResults({
        query: q || '',
        lang: queryLanguage,
        rows: 10,
        page: 1,
        section: section,
        filters: filters,
      }).then(function(res) {
        $scope.results = $scope.treatResults(res, 1, queryLanguage);
      });
    } else {
      $scope.card = 'views/partials/card.html';
      $translate('SEARCH_CARD').then(function(res) {
        $scope.cardcontent = res;
      });
    }

    $scope.changePage = function() {
      var queryLanguage = $scope.targetLang || $scope.kConfig.lang;
      resultsService.getResults({
        query: q || '',
        lang: queryLanguage,
        rows: 10,
        page: $scope.results.currentPage,
        section: section,
        filters: filters,
      }).then(function(res) {
        $window.scrollTo(0,0);
        $scope.results = $scope.treatResults(res,
          $scope.results.currentPage, queryLanguage);
      });
    };

    $scope.treatResults = function(res, page, lang) {
      if (!lang) {
        lang = $scope.kConfig.lang;
      }
      var results = res.data.grouped.domain;
      results.all = 'all';
      results.nbPages = res.data.grouped.domain.matches / 10;
      results.currentPage = page;
      results.maxSize = 10;
      results.sections = res.data.facet_counts
        .facet_fields.khresmoi_sections_sectionType_facet;
      res.data.grouped.domain.groups.forEach(function(link) {
        // Handle extra datas and mutators
        // Region free title
        link.doclist.docs[0].title =
          link.doclist.docs[0]['title_' + lang];

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

        if (lang !== $scope.kConfig.lang) {
          // Translations
          // Title
          translationService
            .translate(link.doclist.docs[0].title, lang, $scope.kConfig.lang)
            .then(function(res) {
              if (!res.translation) {return;}

              var translatedTitle = res.translation;
              link.doclist.docs[0].translatedTitle = translatedTitle;
            });

          // Snippet
          translationService
            .translate(link.doclist.docs[0].snippet, lang, $scope.kConfig.lang)
            .then(function(res) {
              if (!res.translation) {return;}
              var translatedSnippet = res.translation;
              link.doclist.docs[0].translatedSnippet = translatedSnippet;
            });
        }
      });
      return results;
    };
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

var extractDefinitionFromDisambiguator = function(query, data) {
  if (!data || !data.results) {
    return null;
  }

  for (var i = 0; i < data.results.length; i++) {
    var result = data.results[i];
    var definition = honTrim(result.definition);
    var url = result.uri && result.uri.namespace + result.uri.localName;

    var foundExactLabel = result.label &&
      equalsIgnoreCase(honTrim(result.label), query);

    if (!foundExactLabel && result.labels) {
      for (var j = 0; j < result.labels.length; j++) {
        var label = honTrim(result.labels[j]);
        if (equalsIgnoreCase(label, query)) {
          foundExactLabel = true;
          break;
        }
      }
    }
    if (foundExactLabel && definition && url && foundExactLabel) {
      var cleanedQuery = query.replace(/^./, query.charAt(0).toUpperCase());
      var list = definition.split(/[A-Z]+:/);
      var def = list[1] ? list[1] : list[0];
      def = def.replace(/,$/, '').toLowerCase();
      def = capitalizeSentences(def,1);
      return {
        type: 'views/fatheads/definition.html',
        title: cleanedQuery,
        content: def,
        url: url,
      };
    }
  }
};

var honTrim = function(str) {
  return !str ? str : str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

var equalsIgnoreCase = function(first, second) {
  if (!first) {
    return !second;
  }
  if (!second) {
    return false;
  }
  return first.toUpperCase() === second.toUpperCase();
};

var capitalizeSentences  = function(capText, capLock) {
  if (capLock === 1 || capLock === true) {
    capText = capText.toLowerCase();
  }

  var wordSplit = '. ';
  var wordArray = capText.split(wordSplit);
  var numWords  = wordArray.length;

  for (var x = 0; x < numWords; x++) {
    wordArray[x] = wordArray[x].replace(
      wordArray[x].charAt(0),wordArray[x].charAt(0).toUpperCase()
    );
    if (x === 0) {
      capText = wordArray[x] + '. ';
    } else if (x !== numWords - 1) {
      capText = capText + wordArray[x] + '. ';
    }else if (x === numWords - 1) {
      capText = capText + wordArray[x];
    }
  }
  return capText;
};
