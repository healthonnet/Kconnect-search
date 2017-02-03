'use strict';

app.controller('LanguageController',
  ['$scope', '$translate', 'LANGUAGES',
  function($scope, $translate, languages) {
    $scope.changeTo = function(lang) {
      $translate.use(lang);
    };
    $scope.lang = languages;
  },]);
