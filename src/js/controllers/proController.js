'use strict';

app
  .controller('ProController',
    ['$scope', '$location', '$sce', 'spanWordFilter',
      '$translate', 'SuggestionsService',
    function($scope, $location, $sce, spanWord,
       $translate, suggestionsService) {
    $scope.pageTitle = 'Pro';
    $scope.form = {};
    $scope.$emit('proActive');
    $scope.pageIcon = 'fa-user-md';
    $scope.pageTitleColor = 'text-dark-green';
    $scope.test;
    $scope.validateQuery = function(item) {
      console.log('is my query valid ?');
      console.log(item);
      console.log($scope.form.subject);
      console.log($scope.form.predicate);
      console.log($scope.form.object);

      // TODO true -> submit query
      // TODO false -> new autocompletion step
    };
    $scope.getObjects = function(q) {
      var array = [];
      var subject = $scope.form.subject.uri.namespace +
        $scope.form.subject.uri.localName;
      var predicate = $scope.form.predicate.uri.namespace +
        $scope.form.predicate.uri.localName;
      return suggestionsService.getObjects(q, subject, predicate)
        .then(function(res) {
          console.log(res.data.results);
          if (res.data.results.length) {
            array = array.concat(res.data.results);
          }
          return array;
        });
    };
    $scope.getPredicates = function(q) {
      $scope.form.object = undefined;

      var array = [];
      var subject = $scope.form.subject.uri.namespace +
        $scope.form.subject.uri.localName;
      return suggestionsService.getPredicates(q, subject)
        .then(function(res) {
          if (res.data.results.length) {
            array = array.concat(res.data.results);
          }
          return array;
        });
    };
    $scope.getSubjects = function(q) {
      // Clean params
      $scope.form.object = undefined;
      $scope.form.predicate = undefined;
      var array = [];

      return suggestionsService.getSubjects(q)
        .then(function(res) {
          if (res.data.results.length) {
            array = array.concat(res.data.results);
          }
          return array;
        });
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

    var q = $location.search().q;

    if (q) {
      $scope.form.param = q;
      $scope.param = q;
      $scope.showScreenshot = function(link) {
        $scope.screenshot = link;
      };
    } else {
      $scope.card = 'views/partials/card.html';
      $translate('PRO_CARD').then(function(res) {
        $scope.cardcontent = res;
      });
    }
    // TODO: fill with pro controller
  },]);
