'use strict';

app
  .filter('spanWord', function($sce) {
    return function(input, word) {
      var regex = new RegExp('((' + word + ')($|[ ]))', 'gi');
      input = input.replace(regex, '<span>$1</span>');
      return $sce.trustAsHtml(input);
    };
  })
  .controller('SearchController',
  ['$scope', '$location', '$sce', 'TrustabilityService', 'spanWordFilter',
  function($scope, $location, $sce, trustabilityService, spanWord) {
    $scope.pageTitle = 'SEARCH';
    $scope.param = $location.search().q;
    $scope.showScreenshot = function(index) {
      $scope.screenshot = $scope.results.links[index];
    };
    $scope.getColor = function(value) {
      if (value < 33) {
        return '#fd0000';
      }
      if (value < 66) {
        return '#fdef00';
      }
      return '#00dd00';
    };
    $scope.fathead = {
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

    $scope.results = {
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

    // Trustability Requests
    $scope.results.links.forEach(function(link) {
      trustabilityService.getTrustabilityValueFromHost(link.groupValue)
        .then(function(data) {
          link.trustability = data;
        });
    });

  },]);
