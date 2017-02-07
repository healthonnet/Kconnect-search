'use strict';

app.controller('SettingsController',
  ['$scope', 'UserService', 'LANGUAGES',
  function($scope, user, lang) {
    $scope.lang = lang;
    $scope.user = user;
  },]);
