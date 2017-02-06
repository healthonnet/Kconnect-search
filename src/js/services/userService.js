'use strict';

app.factory('UserService', function() {
  var userService = {};

  userService.searchEn = true;
  userService.searchCz = false;
  userService.searchDe = false;
  userService.searchFr = true;
  userService.advancedSearch = false;
  userService.semanticSearch = false;

  userService.changeOption = function(key, value) {
    userService[key] = value;
  };

  userService.saveState = function() {
    sessionStorage.userService = angular.toJson(userService);
  };

  userService.restoreState = function() {
    userService = angular.fromJson(sessionStorage.userService);
  };

  return userService;
});
