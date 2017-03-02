'use strict';

var ResultsPage = function() {
  this.get = function() {
    browser.get('http://localhost:3000');
  };

  this.fillQuery = function(query) {
    if (!query) {
      query = 'cancer';
    }
    element(by.model('form.param')).clear().sendKeys(query);
  };

  this.execSearch = function(query) {
    this.fillQuery(query);
    return element(by.css('.middle-search-submit')).click();
  };

  this.getResults = function() {
    return element.all(
      by.repeater(
        'link in results.groups track by $index'
      )
    );
  };
};

var hasClass = function(element, cls) {
  return element.getAttribute('class').then(function(classes) {
    return classes.split(' ').indexOf(cls) !== -1;
  });
};

describe('Protractor Results Page', function() {
  var resultsPage = new ResultsPage();

  beforeEach(function() {
    resultsPage.get();
  });

  it('should do a search', function() {
    resultsPage.execSearch().then(function() {
      expect(browser.getCurrentUrl()).toContain('?q=cancer');
      resultsPage.getResults().count().then(function(count) {
        expect(count).not.toEqual(0);
      });
    });
  });

  it('should show grey cards', function() {
    resultsPage.execSearch().then(function() {
      resultsPage.getResults().each(function(element, index) {
        expect(hasClass(element, 'highlight')).toBe(true);
      });
    });
  });

  it('should hover a result and not to be grey', function() {
    resultsPage.execSearch().then(function() {
      browser.actions().mouseMove(element(by.css('.highlight'))).perform();
      resultsPage.getResults().each(function(element, index) {
        if (index === 0) {
          expect(hasClass(element, 'highlight')).toBe(false);
        } else {
          expect(hasClass(element, 'highlight')).toBe(true);
        }
      });
    });
  });
});
