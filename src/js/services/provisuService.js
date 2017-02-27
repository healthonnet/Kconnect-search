'use strict';

app.factory('ProvisuService',
  ['$rootElement', 'FONT_SIZE_SPAN', 'DEFAULT_FONT_SIZE',
  function($rootElement, FONT_SIZE_SPAN, DEFAULT_FONT_SIZE) {
    return {
      reset: function() {
        this.showWhite();
        this.showBigger(10);
      },
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
      setFontSize: function(fontSize) {
        if (!fontSize) {
          fontSize = DEFAULT_FONT_SIZE;
        }
        var htm = angular.element(document.querySelector('body'));
        this.clearFontClasses(htm);
        htm.addClass('font-size-' + fontSize);
        return fontSize;
      },
      showBigger: function(fontSize) {
        if (!fontSize) {
          fontSize = DEFAULT_FONT_SIZE;
        }
        var htm = angular.element(document.querySelector('body'));
        var newFontSize = fontSize + FONT_SIZE_SPAN;
        newFontSize =
          (newFontSize > FONT_SIZE_MAX) ? FONT_SIZE_MAX : newFontSize;
        this.clearFontClasses(htm);
        htm.addClass('font-size-' + newFontSize);
        return newFontSize;
      },
      showSmaller: function(fontSize) {
        if (!fontSize) {
          fontSize = DEFAULT_FONT_SIZE;
        }
        var htm = angular.element(document.querySelector('body'));
        var newFontSize = fontSize - FONT_SIZE_SPAN;
        newFontSize =
          (newFontSize < FONT_SIZE_MIN) ? FONT_SIZE_MIN : newFontSize;
        this.clearFontClasses(htm);
        htm.addClass('font-size-' + newFontSize);
        return newFontSize;
      },
      clearFontClasses: function(element) {
        // RemoveClass doesn't support a function as first argument.
        for (var i = FONT_SIZE_MIN; i < FONT_SIZE_MAX; i += FONT_SIZE_SPAN) {
          element.removeClass('font-size-' + i);
        }
      },
    };
  },]);

var FONT_SIZE_MAX = 98;
var FONT_SIZE_MIN = 6;
