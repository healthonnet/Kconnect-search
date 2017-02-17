'use strict';

app.factory('ProvisuService',
  ['$rootElement',
  function($rootElement) {
    return {
      showWhite: function() {
        var htm = angular.element(document.querySelector('body'));
        htm.removeClass('provisu-black');
        htm.removeClass('provisu-blue');
        htm.removeClass('provisu-cyan');
      },
      showBlack: function() {
        var htm = angular.element(document.querySelector('body'));
        htm.removeClass('provisu-blue');
        htm.removeClass('provisu-cyan');
        htm.addClass('provisu-black');
      },
      showBlue: function() {
        var htm = angular.element(document.querySelector('body'));
        htm.removeClass('provisu-black');
        htm.removeClass('provisu-cyan');
        htm.addClass('provisu-blue');
      },
      showCyan: function() {
        var htm = angular.element(document.querySelector('body'));
        htm.removeClass('provisu-black');
        htm.removeClass('provisu-blue');
        htm.addClass('provisu-cyan');
      },
      showBigger: function(fontSize = 14) {
        var htm = angular.element(document.querySelector('body'));
        var newFontSize = fontSize + FONT_SIZE_SPAN;
        newFontSize = (newFontSize > 98) ? 98 : newFontSize;
        htm.removeClass('font-size-' + fontSize);
        htm.addClass('font-size-' + newFontSize);
        return newFontSize;
      },
      showSmaller: function(fontSize = 14) {
        var htm = angular.element(document.querySelector('body'));
        var newFontSize = fontSize - FONT_SIZE_SPAN;
        newFontSize = (newFontSize < 6) ? 4 : newFontSize;
        htm.removeClass('font-size-' + fontSize);
        htm.addClass('font-size-' + newFontSize);
        return newFontSize;
      },
    };
  },]);

var FONT_SIZE_SPAN = 4;
