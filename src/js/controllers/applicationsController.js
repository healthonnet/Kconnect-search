'use strict';

app.controller('ApplicationsController', function($http, $scope) {
  $scope.$emit('appsActive');
  $scope.pageIcon = 'fa-mobile';
  $scope.pageTitleColor = 'text-dark-red';
  $scope.pageTitle = 'Apps';
  $scope.showFilters = false;

  $scope.apps = mockApps;

  $scope.card = mockAppsCard;

  $http.get('images/mock-app/apps.json').then(function(data) {
    $scope.apps = data.data;
  });
});

var mockApps = [{
  title: 'Color Vision Quiz',
  icon: 'images/mock-app/Color Vision Quiz.png',
  android: 'https://play.google.com/store/apps/' +
    'details?id=org.provisu.colorVisionQuiz&hl=en',
  ios: 'https://itunes.apple.com/us/app/' +
  'color-vision-quiz/id1169917156?ls=1&mt=2',
  description: 'The purpose of this application is to provide reliable tools ' +
  'for information, promotion and prevention related to disorders of color ' +
  'vision. It is designed for citizens who want to learn more about vision ' +
  'color disorders.',
  pro: false,
}, {
  title: 'Medscape',
  icon: 'images/mock-app/Medscape.png',
  android: 'https://play.google.com/store/' +
  'apps/details?id=com.medscape.android',
  ios: 'https://itunes.apple.com/fr/app/medscape/id321367289?mt=8',
  description: 'Medscape from WebMD (medscape.com) is the leading medical ' +
  'resource most used by physicians, medical students, nurses ' +
  'and other healthcare professionals for clinical information',
  pro: true,
}, {
  title: 'Epocrates Plus',
  icon: 'images/mock-app/Epocrates Plus.png',
  android: 'https://play.google.com/store/apps/details?id=com.epocrates',
  ios: 'https://itunes.apple.com/fr/app/' +
  'epocrates-reference-tools-for-healthcare-providers/id281935788?mt=8',
  description: 'soon',
  pro: true,
},{
  title: 'DailyRounds - for Doctors',
  icon: 'images/mock-app/DailyRound - for doctors.png',
  android: 'https://play.google.com/store/' +
  'apps/details?id=com.medengage.clinical',
  ios: 'https://itunes.apple.com/fr/app/' +
  'daily-rounds-for-doctors/id1003799400?mt=8',
  description: 'soon',
  pro: true,
},{
  title: 'Figure 1 - Medical Images',
  icon: 'images/mock-app/Figure 1.png',
  android: 'https://play.google.com/store/apps/details?id=com.figure1.android',
  ios: 'https://itunes.apple.com/fr/app/' +
  'figure-1-medical-cases-for-healthcare/id645948529?mt=8',
  description: 'soon',
  pro: true,
},{
  title: 'Sobotta Anatomy Atlas',
  icon: 'images/mock-app/Sobotta.png',
  android: 'https://play.google.com/store/apps/details' +
  '?id=com.austrianapps.elsevier.sobotta',
  ios: 'https://itunes.apple.com/fr/app/sobotta-anatomy-atlas/id567740950?mt=8',
  description: 'soon',
  pro: false,
},{
  title: 'MedPics',
  icon: 'images/mock-app/MedPics.png',
  android: 'https://play.google.com/store/apps/details?id=fr.medpics.MedPics',
  ios: 'https://itunes.apple.com/fr/app/' +
  'medpics-cas-cliniques-collaboratifs/id915567693?mt=8',
  description: 'soon',
  pro: true,
},{
  title: 'e-Pansement',
  icon: 'images/mock-app/e-Pansement.png',
  android: 'https://play.google.com/store/apps/' +
  'details?id=fr.elevate.ipansement',
  ios: 'https://itunes.apple.com/fr/app/e-pansement/id542196988?mt=8',
  description: 'soon',
  pro: true,
},{
  title: 'Mon Pillbox',
  icon: 'images/mock-app/Mon Pillbox.png',
  android: 'https://play.google.com/store/apps/' +
  'details?id=com.tobeamaster.mypillbox',
  description: 'soon',
  pro: false,
},{
  title: 'Pillboxie',
  icon: 'images/mock-app/Pillboxie.png',
  ios: 'https://itunes.apple.com/fr/app/pillboxie/id417367089?mt=8',
  description: 'soon',
  pro: false,
},{
  title: 'AVC HUG',
  icon: 'images/mock-app/AVC HUG.png',
  android: 'https://play.google.com/store/apps/' +
  'details?id=com.hugge.elipsavc.fr',
  ios: 'https://itunes.apple.com/fr/app/avc-hug/id926927352?mt=8',
  description: 'soon',
  pro: false,
},{
  title: 'Doctisia',
  icon: 'images/mock-app/Doctisia.png',
  ios: 'https://itunes.apple.com/fr/app/doctisia/id1018734577?mt=8',
  android: 'https://play.google.com/store/apps/details?id=com.vd4soft.doctisia',
  description: 'soon',
  pro: false,
},];

var mockAppsCard = {
  url: 'views/partials/card.html',
  title: 'Coming soon',
  text: '<p>Search for medical apps</p>',
};
