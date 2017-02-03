'use strict';

app.factory('ScreenshotService', function($http, SCREENSHOT_SERVICE_URL) {
  return {
    getScreenFromUrl: function(url) {
      return $http.get(SCREENSHOT_SERVICE_URL, {
        url: url
      });
    },
    getScreenSrcFromUrl: function(url) {
      return SCREENSHOT_SERVICE_URL + '?url=' + url;
    },
  };
});