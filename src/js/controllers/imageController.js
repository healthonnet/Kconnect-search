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
          $scope.nbResults = res.data.grouped.contentMD5.ngroups;
          parseImageResults(res);
          $scope.page++;
        });
    };

    $scope.page = 0;
    $scope.pageTitle = 'IMAGE';
    $scope.images = [];

    var q = $location.search().q;
    if (q) {
      $scope.param = q;
      $scope.loadImages();
    } else {
      $scope.card = mockImageCard;
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

var mockImageCard = {
  url: 'views/partials/card.html',
  title: 'Sensitive content',
  text: '<p>Some wording to make about sensitive content</p>' +
  '<p>Lookup our <a href="/diclaimer">diclaimer</a></p>',
};