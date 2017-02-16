'use strict';

app.controller('ApplicationsController', function($scope) {
  $scope.$emit('appsActive');
  $scope.pageIcon = 'fa-mobile';
  $scope.pageTitleColor = 'text-dark-red';
  $scope.pageTitle = 'Apps';
  $scope.apps = mockApps;

  $scope.card = mockAppsCard;
});

var mockApps = [{
  title: 'Application Color Vision Quiz',
  icon: 'https://www.provisu.ch/images/2016/10/18/icon2.png',
  android: 'https://play.google.com/store/apps/' +
    'details?id=org.provisu.colorVisionQuiz&hl=en',
  ios: 'https://itunes.apple.com/us/app/' +
  'color-vision-quiz/id1169917156?ls=1&mt=2',
  description: 'The purpose of this application is to provide reliable tools ' +
  'for information, promotion and prevention related to disorders of color ' +
  'vision. It is designed for citizens who want to learn more about vision ' +
  'color disorders.',
}, {
  title: 'Coming soon',
  icon: 'http://icons.iconarchive.com/icons/' +
  'pelfusion/long-shadow-media/256/Mobile-Smartphone-icon.png',
  description: 'soon',
}, {
  title: 'Coming soon',
  icon: 'http://icons.iconarchive.com/icons/' +
  'pelfusion/long-shadow-media/256/Mobile-Smartphone-icon.png',
  description: 'soon',
},];

var mockAppsCard = {
  url: 'views/partials/card.html',
  title: 'Coming soon',
  text: '<p>Search for medical apps</p>',
};
