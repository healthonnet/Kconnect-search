'use strict';

app
  .controller('ProController',
    ['$scope', '$location', '$sce', 'spanWordFilter',
      '$translate', 'SuggestionsService', 'ResultsService',
      'ScreenshotService',
    function($scope, $location, $sce, spanWord,
       $translate, suggestionsService, resultsService,
       screenshotService) {
    $scope.pageTitle = 'Pro';
    $scope.form = {};
    $scope.results = {};
    $scope.$emit('proActive');
    $scope.pageIcon = 'fa-user-md';
    $scope.pageTitleColor = 'text-dark-green';
    $scope.validateQuery = function(item) {
      if ($scope.form.subject && $scope.form.predicate && $scope.form.object) {
        $scope.submit();
      } else {
        // TODO false -> new autocompletion step
        console.log('not complete');
      }
    };
    $scope.getObjects = function(q) {
      var array = [];
      var subject = $scope.form.subject.uri.namespace +
        $scope.form.subject.uri.localName;
      var predicate = $scope.form.predicate.uri.namespace +
        $scope.form.predicate.uri.localName;
      return suggestionsService.getObjects(q, subject, predicate)
        .then(function(res) {
          if (res.data.results.length) {
            array = array.concat(res.data.results);
          }
          return array;
        });
    };
    $scope.getPredicates = function(q) {
      $scope.form.object = undefined;
      $scope.fathead = undefined;

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
      $scope.fathead = undefined;

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
      if (!$scope.form.subject ||
        !$scope.form.predicate ||
        !$scope.form.object) {
        return false;
      }
      /* Prevent useless submit (same request)
      if ($scope.form.param === $location.search().q) {
        return;
      }*/
      $location.search('form', JSON.stringify($scope.form));
    };

    if ($location.search().form) {
      $scope.semanticQuery = JSON.parse($location.search().form);
      $scope.form.subject = $scope.semanticQuery.subject;
      $scope.form.predicate = $scope.semanticQuery.predicate;
      $scope.form.object = $scope.semanticQuery.object;

      var subjectUri = $scope.semanticQuery.subject.uri.namespace +
        $scope.semanticQuery.subject.uri.localName;
      var predicateUri = $scope.semanticQuery.predicate.uri.namespace +
        $scope.semanticQuery.predicate.uri.localName;
      var objectUri = $scope.semanticQuery.object.uri.namespace +
        $scope.semanticQuery.object.uri.localName;

      if ($scope.form.object.definition) {
        $scope.fathead = {
          type: 'views/fatheads/definition.html',
          title: $scope.form.object.label,
          content: $scope.form.object.definition,
        };
      }

      // Paginated results
      resultsService.getSemanticRequest({
        subject: subjectUri,
        predicate: predicateUri,
        object: objectUri,
      }).then(function(results) {
        $scope.mimirQuery = results[0];
        $scope.autocompleteQuery = results[1];
        var page = $scope.results.currentPage || 1;
        resultsService.getTreatments($scope.autocompleteQuery)
          .then(function(treatments) {
            console.log(treatments);
          });
        resultsService.executeMimirQuery($scope.mimirQuery, page)
          .then(function(res) {
            $scope.results = res.results;
            $scope.res = {
              total: res.total,
              currentPage: page,
            };
          });
      });
    }
    if (!$scope.semanticQuery || !$scope.semanticQuery.length) {
      $scope.card = 'views/partials/card.html';
      $translate('PRO_CARD').then(function(res) {
        $scope.cardcontent = res;
      });
    }

    $scope.changePage = function() {
      resultsService.executeMimirQuery(
        $scope.mimirQuery, $scope.res.currentPage)
        .then(function(res) {
          $scope.results = res.results;
        });
    };
  },]);
