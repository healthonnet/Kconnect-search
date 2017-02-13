'use strict';

app
  .controller('NewsController',
    ['$scope', '$location', '$sce', 'spanWordFilter',
    function($scope, $location, spanWord) {
    $scope.pageTitle = 'News';
    $scope.pageIcon = 'fa-newspaper-o';
    // TODO: fill with news controller
  },]);
