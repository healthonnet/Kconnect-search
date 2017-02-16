'use strict';

app.controller('SearchController',
  ['$scope', '$location', 'ResultsService', 'SuggestionService',
  'TrustabilityService', 'ScreenshotService', 'DisambiguatorService',
  function($scope, $location, resultsService, suggestionService,
    trustabilityService, screenshotService, disambiguatorService) {
    $scope.pageTitle = 'Search';
    $scope.pageIcon = 'fa-globe';
    $scope.pageTitleColor = 'text-dark-blue';
    $scope.form = {};
    $scope.searchActive = true;
    $scope.filters = $scope.filters || {};
    $scope.filters = deserialize($location.search().filters);
    $scope.$emit('searchActive');

    $scope.submit = function() {
      if ($scope.form.param !== undefined) {
        // Prevent useless submit (same request)
        if ($scope.form.param === $location.search().q) {
          return;
        }
        $location.search('q', $scope.form.param);
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

    $scope.getSuggestion = function(val) {
      if (val.length < 3) {return;}
      return suggestionService.getSuggestion(val)
      .then(function(res) {
        return res.data.suggestions;
      });
    };

    var q = $location.search().q;
    var section = $location.search().section;
    var filters = $location.search().filters;

    if (q) {
      $scope.form.param = q;
      $scope.param = q;
      $scope.getColor = getColor;
      disambiguatorService.getFatheadContent(q)
        .then(function(res) {
          $scope.fathead = {
            type: 'definition',
            title: 'Definition of ' + q,
            content: res.data.results[0].definition,
          };
        });

      // TODO Pagination + lang
      resultsService.getResults({
        query: q,
        lang: 'en',
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

var mockCard = {
  url: 'views/partials/card.html',
  title: 'Benefits',
  text: 'Not for profit | No <span>ads</span> | ' +
    'No <span>cookies</span><br />' +
    'Lookup our <a href="/privacy">Privacy Policies</a>',
};
