'use strict';

app
  .controller('NewsController',
    ['$scope', '$location', 'NewsService', 'spanWordFilter',
    function($scope, $location, newsService, spanWord) {
    $scope.pageTitle = 'News';
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
      $scope.param = q;
      $scope.form.param = q;
      newsService.getNews(q)
        .then(function(res) {
          $scope.results = res.data.results;
        });
    }
  },]);
