'use strict';

app.controller('AppController',
  ['$scope', '$translate', 'LANGUAGES', 'VERSION',
      'DEFAULT_PREFERENCES', '$location',
      'localStorageService', 'ProvisuService',
  function($scope, $translate, lang, version,
           defaultPreferences, $location,
           localStorageService, provisuService) {
    $scope.init = function() {
      // Filters
      $scope.languages = lang;
      $scope.showFilters = false;
      $scope.toggleFilters = function() {
        $scope.showFilters = !$scope.showFilters;
      };

      // Pro Visu Service
      $scope.logotypeProvisu = $scope.logotypeProvisu || 'images/kconnect.svg';
      $scope.lowVision = false;
      $scope.provisu = function() {
        $scope.lowVision = !$scope.lowVision;
      };
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
