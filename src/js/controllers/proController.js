'use strict';

app
  .controller('ProController',
    ['$scope', '$location', '$sce', 'spanWordFilter',
    function($scope, $location, $sce, spanWord) {
    $scope.pageTitle = 'Pro';
    $scope.form = {};
    $scope.$emit('proActive');
    $scope.pageIcon = 'fa-user-md';
    $scope.pageTitleColor = 'text-dark-green';

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
