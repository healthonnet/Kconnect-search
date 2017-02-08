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
      $scope.currentQuery = $location.search().q;
    });
    $scope.version = version;
  },]);
