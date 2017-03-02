'use strict';

exports.config = {
  specs: ['src/tests/*.js'],
  directConnect: true,
  seleniumServerJar: './node_modules/protractor/node_modules/' +
  'webdriver-manager/selenium/selenium-server-standalone-3.1.0.jar',
};
