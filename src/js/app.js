'use strict';

var app = angular.module('App', [
  'ui.bootstrap',
  'ui.toggle',
  'angular-loading-bar',
  'ngRoute',
  'pascalprecht.translate',
  'ngResource',
  'angular-svg-round-progressbar',
  'favicon',
  'angularGrid',
  'dcbImgFallback',
  'angularMoment',
  'LocalStorageModule',
  'bootstrapLightbox',
  'hc.marked',
])
  .directive('hideUntilGood', function() {
    return {
      restrict: 'A',
      multiElement: true,
      link: function(scope, element, attrs) {
        attrs.$observe('ngSrc', function(value) {
          if (!value || value.length === 0) {
            element.attr('src', value);
          }
          element.css('display', 'none');
        });
        element.bind('load', function() {
          element.css('display', '');
        });
      },
    };
  })
  .config(function($routeProvider, $translateProvider,
                   $locationProvider, localStorageServiceProvider,
                   LightboxProvider) {

    $translateProvider
      .useStaticFilesLoader({
        prefix: 'locales/locale-',
        suffix: '.json',
      })
      .useSanitizeValueStrategy('sce')
      .preferredLanguage('en');

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false,
    });

    $routeProvider
      .when('/', {
        templateUrl: 'views/search.html',
        controller: 'SearchController',
      })
      .when('/about', {
        templateUrl: 'views/static.html',
        controller: 'StaticController',
      })
      .when('/disclaimer', {
        templateUrl: 'views/static.html',
        controller: 'StaticController',
      })
      .when('/privacy', {
        templateUrl: 'views/static.html',
        controller: 'StaticController',
      })
      .when('/help', {
        templateUrl: 'views/static.html',
        controller: 'StaticController',
      })
      .when('/images', {
        templateUrl: 'views/image.html',
        controller: 'ImageController',
      })
      /* Temporary disabled
      .when('/news', {
        templateUrl: 'views/news.html',
        controller: 'NewsController',
      }) */
      .when('/pro', {
        templateUrl: 'views/prosearch.html',
        controller: 'ProController',
      })
      /*
       Disable settings view
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsController',
      })*/
      .when('/language', {
        templateUrl: 'views/language.html',
        controller: 'LanguageController',
      })
      .when('/apps', {
        templateUrl: 'views/apps.html',
        controller: 'ApplicationsController',
      })
      .when('/extension', {
        templateUrl: 'views/about.html',
      })
      .otherwise({
        redirectTo: function() {
          return '/' + location.search;
        }
      });

    localStorageServiceProvider
        .setPrefix('kcon')
        .setDefaultToCookie(false);

    // Set a custom template
    LightboxProvider.templateUrl = 'views/partials/image-lightbox.html';
    // LightboxProvider.fullScreenMode = true;
  });
