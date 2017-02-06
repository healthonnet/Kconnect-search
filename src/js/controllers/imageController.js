'use strict';

app
  .controller('ImageController',
  ['$scope', '$location', 'ImageService', 'angularGridInstance',
  function($scope, $location, $imageService, angularGridInstance) {
    function parseImageResults(res) {
      res.data.grouped.contentMD5.groups.forEach(function(group) {
        group.doclist.docs[0].actualHeight  = group.doclist.docs[0].height;
        group.doclist.docs[0].actualWidth = group.doclist.docs[0].width;
        $scope.images.push(group.doclist.docs[0]);
      });
    }
    $scope.loadImages = function() {
      console.log('hey !');
      $imageService.getImageResults($scope.param, 'en', 10, $scope.page)
        .then(function(res) {
          parseImageResults(res);
          $scope.page++;
        });
    };

    $scope.page = 0;
    $scope.pageTitle = 'SEARCH';
    $scope.images = [];
    $scope.param = $location.search().q;
    if ($scope.param) {
      $scope.loadImages();
    }
    $scope.angularGridOptions = {
      gridWidth: 250,
      gutterSize: 10,
      pageSize: 3,
      infiniteScrollDistance: 80,
      scrollContainer: '.results',
      performantScroll: true,
    };

    $scope.refresh = function() {
      angularGridInstance.gallery.refresh();
    };
  },]);
