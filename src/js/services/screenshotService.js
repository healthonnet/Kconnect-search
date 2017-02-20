'use strict';

app.factory('ScreenshotService', function($http, SCREENSHOT_SERVICE_URL) {
  return {
    getScreenFromUrl: function(url) {
      return $http.get(SCREENSHOT_SERVICE_URL, {
        url: url
      });
    },
    getScreenSrcFromUrl: function(url) {
      return SCREENSHOT_SERVICE_URL + '?url=' + url +
          '&clipRect=%7B"top"%3A0%2C"left"%3A0%2C' +
          '"width"%3A1024%2C"height"%3A768%7D';
    },
  };
});