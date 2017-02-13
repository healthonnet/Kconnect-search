'use strict';

app.controller('AppController',
  ['$scope', '$translate', 'LANGUAGES', 'VERSION', '$location',
  function($scope, $translate, lang, version, $location) {
    $scope.lang = lang[$translate.proposedLanguage()];
    $scope.$on('switchLang', function(event, args) {
      $scope.lang = lang[args];
    });
    $scope.$on('$routeChangeSuccess', function(evt, absNewUrl, absOldUrl) {
      $scope.previous = absOldUrl;
    });
    $scope.$on('$locationChangeSuccess', function() {
      $scope.currentQuery =
          $location.search().q ? '?q=' + $location.search().q : '';
    });
    $scope.version = version;
    $scope.$on('newsActive', function(event, args) {
      $scope.newsActive = true;
      $scope.searchActive = false;
      $scope.picturesActive = false;
      $scope.proActive = false;
    });
    $scope.$on('searchActive', function(event, args) {
      $scope.searchActive = true;
      $scope.newsActive = false;
      $scope.picturesActive = false;
      $scope.proActive = false;
    });
    $scope.$on('picturesActive', function(event, args) {
      $scope.picturesActive = true;
      $scope.searchActive = false;
      $scope.newsActive = false;
      $scope.proActive = false;
    });
    $scope.$on('proActive', function(event, args) {
      $scope.searchActive = false;
      $scope.newsActive = false;
      $scope.picturesActive = false;
      $scope.proActive = true;
    });
    $scope.$on('noneActive', function(event, args) {
      $scope.searchActive = false;
      $scope.newsActive = false;
      $scope.picturesActive = false;
      $scope.proActive = false;
    });
  },]);
