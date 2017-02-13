'use strict';

var app = angular.module('App', [
  'ui.bootstrap',
  'ngRoute',
  'pascalprecht.translate',
  'ngResource',
  'angular-svg-round-progressbar',
  'favicon',
  'angularGrid',
  'dcbImgFallback',
])
  .config(function($routeProvider, $translateProvider, $locationProvider) {

    $translateProvider.useStaticFilesLoader({
      prefix: 'locales/locale-',
      suffix: '.json',
    });

    $translateProvider.useSanitizeValueStrategy('sce');
    $translateProvider.preferredLanguage('en');

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
      .when('/news', {
        templateUrl: 'views/news.html',
        controller: 'NewsController',
      })
      .when('/pro', {
        templateUrl: 'views/search.html',
        controller: 'ProController',
      })
      .when('/language', {
        templateUrl: 'views/language.html',
        controller: 'LanguageController',
      });
  });
