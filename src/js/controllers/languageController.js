'use strict';

app.controller('LanguageController',
  ['$scope', '$translate', '$location', 'LANGUAGES',
  function($scope, $translate, $location, languages) {
    $scope.$emit('noneActive');
    $scope.changeTo = function(lang) {
      $scope.switchLang(lang);
      if ($scope.previous) {
        $location.path($scope.previous.$$route.originalPath);
      } else {
        $location.path('/');
      }
    };
    $scope.languages = languages;
  },]);
