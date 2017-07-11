'use strict';

app.controller('AppController',
  ['$scope', '$translate', 'LANGUAGES', 'VERSION',
      'DEFAULT_PREFERENCES', '$location', 'SuggestionsService',
      'localStorageService', 'ProvisuService',
  function($scope, $translate, lang, version,
           defaultPreferences, $location, suggestionsService,
           localStorageService, provisuService) {
    $scope.init = function() {
      // Filters
      $scope.languages = lang;
      $scope.showFilters = false;
      $scope.toggleFilters = function() {
        $scope.showFilters = !$scope.showFilters;
      };

      // App values & settings
      $scope.kConfig = defaultPreferences;
      $scope.kConfig.lang = $translate.proposedLanguage();
      $scope.version = version;

      // Register Events
      registerEvents();

      // Init localStorage
      initLocalStorage();

      // Init Lang
      $scope.switchLang($scope.kConfig.lang);

      // Init Pro Visu Service
      $scope.initProvisu();

      $scope.logotypeProvisu = $scope.logotypeProvisu || 'images/kconnect.svg';

      $scope.provisu = function() {
        $scope.kConfig.lowVision = !$scope.kConfig.lowVision;
        $scope.initProvisu();
      };

    };

    $scope.getSuggestion = function(val, lang) {
      if (!lang) {
        lang = $scope.kConfig.lang;
      }

      var array = [];
      return suggestionsService.getSpellcheck(val, lang)
        .then(function(res) {
          var results = suggestionsService.cureSpellcheck(res.data);
          if (results.length) {
            array = array.concat(results);
          }
          return suggestionsService.getSuggestions(val, lang);
        })
        .then(function(res) {
          array = array.concat(res.data.suggestions);
          return suggestionsService.getQuestions(val, lang);
        })
        .then(function(res) {
          array = array.concat(res.data);
          return array;
        });
    };

    // Private functions & Utils
    $scope.switchLang = function(newlang) {
      $translate.use(newlang);
      $scope.lang = lang[newlang];
      $scope.kConfig.lang = $scope.lang.key;
    };

    function registerEvents() {
      // Events
      $scope.$on('$routeChangeSuccess', function(evt, absNewUrl, absOldUrl) {
        $scope.previous = absOldUrl;
      });
      $scope.$on('$locationChangeSuccess', function() {
        $scope.currentQuery =
          $location.search().q ? '?q=' + $location.search().q : '';
      });
    }

    $scope.version = version;
    $scope.$on('newsActive', function(event, args) {
      $scope.newsActive = true;
      $scope.searchActive = false;
      $scope.picturesActive = false;
      $scope.proActive = false;
      $scope.appsActive = false;
    });
    $scope.$on('searchActive', function(event, args) {
      $scope.searchActive = true;
      $scope.newsActive = false;
      $scope.picturesActive = false;
      $scope.proActive = false;
      $scope.appsActive = false;
    });
    $scope.$on('picturesActive', function(event, args) {
      $scope.picturesActive = true;
      $scope.searchActive = false;
      $scope.newsActive = false;
      $scope.proActive = false;
      $scope.appsActive = false;
    });
    $scope.$on('proActive', function(event, args) {
      $scope.searchActive = false;
      $scope.newsActive = false;
      $scope.picturesActive = false;
      $scope.proActive = true;
      $scope.appsActive = false;
    });
    $scope.$on('appsActive', function(event, args) {
      $scope.searchActive = false;
      $scope.newsActive = false;
      $scope.picturesActive = false;
      $scope.proActive = false;
      $scope.appsActive = true;
    });
    $scope.$on('noneActive', function(event, args) {
      $scope.searchActive = false;
      $scope.newsActive = false;
      $scope.picturesActive = false;
      $scope.proActive = false;
      $scope.appsActive = false;
    });

    // Provisu Utils
    $scope.initProvisu = function() {
      if ($scope.kConfig.lowVision) {
        provisuService.setFontSize($scope.kConfig.fontSize);
        $scope.setProvisu($scope.kConfig.mainColor);
      } else {
        $scope.setProvisu();
      }
    };

    $scope.setProvisu = function(color) {
      switch (color) {
        case 'White': {
          provisuService.showWhite();
          $scope.logotypeProvisu = 'images/kconnect.svg';
          $scope.kConfig.mainColor = 'White';
          break;
        }
        case 'Black': {
          provisuService.showBlack();
          $scope.logotypeProvisu = 'images/kconnect-yellow.svg';
          $scope.kConfig.mainColor = 'Black';
          break;
        }
        case 'Blue': {
          provisuService.showBlue();
          $scope.logotypeProvisu = 'images/kconnect-blue.svg';
          $scope.kConfig.mainColor = 'Blue';
          break;
        }
        case 'Cyan': {
          provisuService.showCyan();
          $scope.logotypeProvisu = 'images/kconnect-cyan.svg';
          $scope.kConfig.mainColor = 'Cyan';
          break;
        }
        default: {
          provisuService.reset();
          $scope.logotypeProvisu = 'images/kconnect.svg';
        }
      }
    };

    $scope.bigger = function() {
      $scope.kConfig.fontSize =
        provisuService.showBigger($scope.kConfig.fontSize);
    };
    $scope.smaller = function() {
      $scope.kConfig.fontSize =
        provisuService.showSmaller($scope.kConfig.fontSize);
    };

    function initLocalStorage() {
      if (localStorageService.isSupported) {

        // Init localstorage values
        for (var prop in $scope.kConfig) {
          if ($scope.kConfig.hasOwnProperty(prop)) {
            if (localStorageService.get(prop) === null) {
              localStorageService.set(prop, $scope.kConfig[prop]);
            }
            localStorageService.bind($scope, 'kConfig.' + prop,
              localStorageService.get(prop), prop);
          }
        }

        var kconKeys = localStorageService.keys();
        if (kconKeys.length > 0) {
          // Clean unused keys from localStorage
          kconKeys.forEach(function(kconKey) {
            if (!$scope.kConfig.hasOwnProperty(kconKey)) {
              localStorageService.remove(kconKey);
            }
          });
        } else {
          console.error('enable to init localStorage');
        }
      } else {
        console.error('localStorage is not supported');
      }
    }
    $scope.init();

  },]);
