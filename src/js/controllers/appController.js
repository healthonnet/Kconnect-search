'use strict';

app.controller('AppController', ['$scope', '$translate', 'LANGUAGES',
  function($scope, $translate, lang) {
    $scope.lang = lang[$translate.proposedLanguage()];
    $scope.$on('switchLang', function(event, args) {
      $scope.lang = lang[args];
    });
    $scope.$on('$routeChangeSuccess', function(evt, absNewUrl, absOldUrl) {
      $scope.previous = absOldUrl;
    });
  },]);
