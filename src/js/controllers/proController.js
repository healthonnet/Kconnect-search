'use strict';

app
  .controller('ProController',
    ['$scope', '$location', '$sce', 'spanWordFilter',
      '$translate', 'SuggestionsService', 'ResultsService',
    function($scope, $location, $sce, spanWord,
       $translate, suggestionsService, resultsService) {
    $scope.pageTitle = 'Pro';
    $scope.form = {};
    $scope.results = {};
    $scope.$emit('proActive');
    $scope.pageIcon = 'fa-user-md';
    $scope.pageTitleColor = 'text-dark-green';
    $scope.clearField = function(idField) {
      var element = document.getElementById(idField);
      element.blur();
      setTimeout(function() {
        element.focus();},0);
    };
    $scope.validateQuery = function(idNextStep) {
      if ($scope.form.subject && $scope.form.predicate && $scope.form.object) {
        $scope.submit();
      } else {
        setTimeout(function() {
          var focus = document.getElementById(idNextStep);
          if (focus) {
            focus.focus();
          }
        },300);
        console.log('not complete');
      }
    };
    $scope.getObjects = function(q) {
      var array = [];
      var subject = $scope.form.subject.uri;
      var predicate = $scope.form.predicate.uri;
      return suggestionsService.getObjects(q, subject, predicate)
        .then(function(res) {
          if (res.length) {
            array = array.concat(res);
          }
          return array;
        });
    };
    $scope.getPredicates = function(q) {
      $scope.form.object = undefined;
      $scope.fathead = undefined;

      var array = [];
      var subject = $scope.form.subject.uri;
      return suggestionsService.getPredicates(q, subject)
        .then(function(res) {
          if (res.length) {
            array = array.concat(res);
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
          if (res.length) {
            array = array.concat(res);
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

      $location.search('form', JSON.stringify($scope.form));
    };

    if ($location.search().form) {
      $scope.semanticQuery = JSON.parse($location.search().form);
      $scope.form.subject = $scope.semanticQuery.subject;
      $scope.form.predicate = $scope.semanticQuery.predicate;
      $scope.form.object = $scope.semanticQuery.object;

      var subjectUri = $scope.semanticQuery.subject.uri;
      var predicateUri = $scope.semanticQuery.predicate.uri;
      var objectUri = $scope.semanticQuery.object.uri;

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
            if (treatments.length) {
              $scope.fathead = {
                type: 'views/fatheads/treatments.html',
                title: $scope.form.object.label,
                content: treatments,
              };
            }
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
