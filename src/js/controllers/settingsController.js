'use strict';

app.controller('SettingsController',
  ['$scope', 'LANGUAGES',
  function($scope, lang) {
    $scope.lang = lang;
    $scope.searchEn = true;
    $scope.searchCz = false;
    $scope.searchDe = false;
    $scope.searchFr = true;
    $scope.advancedSearch = false;
    $scope.semanticSearch = false;
  },]);
