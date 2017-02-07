'use strict';

app
  .controller('ProController',
    ['$scope', '$location', '$sce', 'spanWordFilter',
    function($scope, $location, $sce, spanWord) {
    $scope.pageTitle = 'Pro';

    var q = $location.search().q;
    if (q) {
      $scope.param = q;
      $scope.showScreenshot = function(link) {
        $scope.screenshot = link;
      };
    } else {
      $scope.card = mockProCard;
    }
    // TODO: fill with pro controller
  },]);

var mockProCard = {
  url: 'views/partials/card.html',
  title: 'Professional search',
  text: 'Lookup our <a href="/privacy">tutorial</a>',
};
