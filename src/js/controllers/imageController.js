'use strict';

app
  .controller('ImageController',
  ['$scope', '$location', 'ImageService', 'angularGridInstance', '$translate',
  function($scope, $location, $imageService, angularGridInstance, $translate) {
    $scope.$emit('picturesActive');
    $scope.pageIcon = 'fa-picture-o';
    $scope.pageTitleColor = 'text-dark-purple';
    $scope.showFilters = false;

    function parseImageResults(res) {
      res.data.grouped.contentMD5.groups.forEach(function(group) {
        group.doclist.docs[0].actualHeight  = group.doclist.docs[0].height;
        group.doclist.docs[0].actualWidth = group.doclist.docs[0].width;
        $scope.images.push(group.doclist.docs[0]);
      });
    }

    $scope.loadImages = function() {
      $imageService.getImageResults(
          $scope.param, $scope.lang.key, 10, $scope.page)
        .then(function(res) {
          $scope.nbResults = res.data.grouped.contentMD5.groups.length;
          parseImageResults(res);
          $scope.page++;
        });
    };

    $scope.angularGridOptions = {
      gridWidth: 250,
      gutterSize: 10,
      pageSize: 3,
      infiniteScrollDistance: 80,
    };

    $scope.refresh = function() {
      angularGridInstance.gallery.refresh();
    };

    $scope.submit = function() {
      if ($scope.form.param !== undefined) {
        // Prevent useless submit (same request)
        if ($scope.form.param === $location.search().q) {
          return;
        }
        $location.search('q', $scope.form.param);
      }
    };

    $scope.page = 0;
    $scope.pageTitle = 'Images';
    $scope.images = [];
    $scope.form = {};

    var q = $location.search().q;
    if (q) {
      $scope.param = q;
      $scope.form.param = q;
      $scope.loadImages();
    } else {
      $scope.card = 'views/partials/card.html';
      $translate('IMAGE_CARD').then(function(res) {
        $scope.cardcontent = res;
      });
    }
  },]);
