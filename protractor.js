'use strict';

exports.config = {
  specs: ['src/tests/*.js'],
  directConnect: true,
  seleniumServerJar: './node_modules/protractor/node_modules/' +
  'webdriver-manager/selenium/selenium-server-standalone-3.1.0.jar',
  onPrepare: function() {
    var width = 1600;
    var height = 1200;
    browser.driver.manage().window().setSize(width, height);
  },
};
