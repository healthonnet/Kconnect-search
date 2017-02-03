'use strict';

app.controller('AppController', ['$scope', '$translate', 'LANGUAGES',
  function($scope, $translate, lang) {
    console.log($translate.use());
    $scope.lang = {};
  },]);
