'use strict';

app.controller('LanguageController',
  ['$scope', '$translate', '$location', 'LANGUAGES',
  function($scope, $translate, $location, languages) {
    $scope.changeTo = function(lang) {
      $translate.use(lang);
      $scope.$emit('switchLang', lang);
      $location.path($scope.previous.$$route.originalPath);
    };
    $scope.lang = languages;
  },]);
