'use strict';

var ResultsPage = function() {
  this.get = function() {
    browser.get('http://localhost:3000');
  };

  this.fillQuery = function(query) {
    if (!query) {
      query = 'cancer';
    }
    element(by.model('form.param')).setKeys(query);
  };

  this.execSearch = function() {
    // TODO: do the search
  };
};

describe('Protractor Results Page', function() {
  var resultsPage = new ResultsPage();

  beforeEach(function() {
    resultsPage.get();
  });

  it('should do a search', function() {
    resultsPage.fillQuery();
    // TODO: test
  });

  it('should show grey cards', function() {
    // TODO: test
  });

  // T
  // it('should have lang button', function() {
  //   browser.get('http://localhost:3000');
  //   var langLink = element(by.css('a[href*="language"]'));
  //   expect(langLink.isDisplayed()).toBe(true);
  // });
});
