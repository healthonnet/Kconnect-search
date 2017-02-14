'use strict';

app.controller('SearchController',
  ['$scope', '$location', 'ResultsService',
  'TrustabilityService', 'ScreenshotService', 'DisambiguatorService',
  function($scope, $location, resultsService,
    trustabilityService, screenshotService, disambiguatorService) {
    $scope.pageTitle = 'Search';
    $scope.pageIcon = 'fa-globe';
    $scope.pageTitleColor = 'text-dark-blue';
    $scope.form = {};
    $scope.searchActive = true;
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

    var q = $location.search().q;

    if (q) {
      $scope.form.param = q;
      $scope.param = q;
      $scope.showScreenshot = function($index) {
        $scope.screenshot = $scope.results.groups[$index].doclist.docs[0];
        $scope.screenshot.preview =
            screenshotService.getScreenSrcFromUrl($scope.screenshot.url);
      };
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
      resultsService.getResults(q, 'en', 10, $scope.page)
        .then(function(res) {
          $scope.results = res.data.grouped.domain;
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

var mockFathead = {
  type: 'definition',
  title: 'Definition of Cancer',
  content: 'A term for diseases in which abnormal cells divide without ' +
    'control and can invade nearby tissues. Malignant cells can also ' +
    'spread to other parts of the body through the blood and lymph ' +
    'systems. There are several main types of malignancy. Carcinoma is ' +
    'a malignancy that begins in the skin or in tissues that line or ' +
    'cover internal organs. Sarcoma is a malignancy that begins in bone, ' +
    'cartilage, fat, muscle, blood vessels, or other connective or ' +
    'supportive tissue. Leukemia is a malignancy that starts in ' +
    'blood-forming tissue such as the bone marrow, and causes large ' +
    'numbers of abnormal blood cells to be produced and enter the blood. ' +
    'Lymphoma and multiple myeloma are malignancies that begin in the ' +
    'cells of the immune system. Central nervous system cancers are ' +
    'malignancies that begin in the tissues of the brain and spinal cord.',
};
