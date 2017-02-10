'use strict';

app.controller('SearchController',
  ['$scope', '$location', '$sce', 'TrustabilityService', 'spanWordFilter',
  function($scope, $location, $sce, trustabilityService, spanWord) {
    $scope.pageTitle = 'Search';
    $scope.form = {};

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
      $scope.showScreenshot = function(index) {
        $scope.screenshot = $scope.results.links[index];
      };
      $scope.getColor = getColor;
      $scope.fathead = mockFathead;
      $scope.results = mockResults;

      // Trustability Requests
      $scope.results.links.forEach(function(link) {
        trustabilityService.getTrustabilityValueFromHost(link.groupValue)
          .then(function(data) {
            link.trustability = data;
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

var mockResults = {
  size: 2,
  links: [
    {
      groupValue: 'www.nhs.uk',
      url: 'https://www.nhs.uk/Conditions/Cancer/Pages/Introduction.aspx',
      screenshot: 'http://everyone.khresmoi.eu:3000/' +
      '?url=http%3A%2F%2Fwww.paho.org%2Ftierra%2Findex.php' +
      '%3Foption%3Dcom_multicategories%26view%3Dcategory' +
      '%26id%3D30%26Itemid%3D114%26lang%3Den',
      readability: '32',
      certified: false,
      title: 'Cancer - NHS Choices',
      content: 'Cancer is a condition where cells in a ' +
      'specific part of the body grow and reproduce uncontrollably. ' +
      'The cancerous cells can invade and destroy surrounding healthy ...',
    },
    {
      groupValue: 'wikipedia.org',
      url: 'https://en.wikipedia.org/wiki/Cancer',
      screenshot: 'http://everyone.khresmoi.eu:3000/' +
      '?url=http%3A%2F%2Fen.wikipedia.org%2Fwiki%2FGenetics_of_cancer',
      title: 'Cancer - Wikipedia',
      readability: '92',
      certified: true,
      content: 'Cancer is a group of diseases involving ' +
      'abnormal cell growth with the potential to invade or spread to ' +
      'other parts of the body. Not all tumors are ...',
    },
  ],
};
