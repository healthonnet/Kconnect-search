'use strict';

app.controller('AppController',
  ['$scope', '$translate', 'LANGUAGES', 'VERSION',
  function($scope, $translate, lang, version) {
    $scope.lang = lang[$translate.proposedLanguage()];
    $scope.$on('switchLang', function(event, args) {
      $scope.lang = lang[args];
    });
    $scope.$on('$routeChangeSuccess', function(evt, absNewUrl, absOldUrl) {
      $scope.previous = absOldUrl;
    });
    $scope.version = version;
  },]);
