'use strict';

app
  .controller('NewsController',
    ['$scope', '$location', '$sce', 'spanWordFilter',
    function($scope, $location, spanWord) {
    $scope.pageTitle = 'News';
    $scope.$emit('newsActive');
    // TODO: fill with news controller
  },]);
