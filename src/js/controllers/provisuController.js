'use strict';

app.controller('ProvisuController', ['$scope', 'ProvisuService',
  function($scope, provisuService) {
  $scope.showWhite = function() {
    provisuService.showWhite();
    $scope.logotypeProvisu = 'images/kconnect.svg';
  };
  $scope.showBlack = function() {
    provisuService.showBlack();
    $scope.logotypeProvisu = 'images/kconnect-yellow.svg';
  };
  $scope.showBlue = function() {
    provisuService.showBlue();
    $scope.logotypeProvisu = 'images/kconnect-blue.svg';
  };
  $scope.showCyan = function() {
    provisuService.showCyan();
    $scope.logotypeProvisu = 'images/kconnect-cyan.svg';
  };
  $scope.bigger = function() {
    $scope.fontSize = provisuService.showBigger($scope.fontSize);
  };
  $scope.smaller = function() {
    $scope.fontSize = provisuService.showSmaller($scope.fontSize);
  };
},]);