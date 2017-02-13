'use strict';

app.controller('StaticController', function($scope, $location) {
    var page = '';
    var title = '';
    var content = '';

    page = $location.path().substring(1).toUpperCase();
    title = 'PAGE_' + page + '_TITLE';
    content = 'PAGE_' + page + '_TEXT';

    $scope.pageTitle = title;
    $scope.pageContent = content;
    $scope.$emit('noneActive');
  });
