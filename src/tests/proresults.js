'use strict';

var ResultsPage = function() {
  this.get = function() {
    browser.get('http://localhost:3000/pro');
  };

  this.fillSubject = function(subject) {
    if (!subject) {
      subject = 'Drug';
    }
    element(by.model('form.subject')).clear().sendKeys(subject);
    return element(by.model('form.subject')).sendKeys(protractor.Key.ENTER);
  };

  this.fillPredicate = function(predicate) {
    if (!predicate) {
      predicate = 'has indication';
    }
    element(by.model('form.predicate')).clear().sendKeys(predicate);
    return element(by.model('form.predicate')).sendKeys(protractor.Key.ENTER);
  };

  this.fillObject = function(object) {
    if (!object) {
      object = 'diabetes';
    }
    element(by.model('form.object')).clear().sendKeys(object);
    return element(by.model('form.object')).sendKeys(protractor.Key.ENTER);
  };

  this.fillQuery = function(subject, predicate, object) {
    this.fillSubject(subject);
    this.fillPredicate(predicate);
    return this.fillObject(object);
  };

  this.fillBadQuery = function() {
    this.fillSubject();
    return this.fillPredicate('bad entry');
  };

  this.fillAndEdit = function() {
    this.fillSubject();
    this.fillPredicate();
    element(by.model('form.object')).clear().sendKeys('diabetes');
    return this.fillPredicate();
  };

  this.execSearch = function(subject, predicate, object) {
    return this.fillQuery(subject, predicate, object);
  };

  this.getResults = function() {
    return element.all(
      by.repeater(
        'link in results track by $index'
      )
    );
  };

  this.getFathead = function(type) {
    if (!type) {
      type = '.fathead';
    }
    return element(by.css(type));
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

  it('shouldn\'t keep unknown entry', function() {
    var test = function() {
      resultsPage.fillBadQuery().then(function() {
        expect(element(by.model('form.predicate')).getAttribute('value')).toEqual('bad entry');
        expect(element(by.model('form.object')).isPresent()).toBe(false);
        element(by.model('form.subject')).click().then(function() {
          expect(element(by.model('form.predicate')).getAttribute('value')).toEqual('');
        });
      });
    };

    // Run the test
    test();
    // Same behaviour on results page
    resultsPage.execSearch().then(function() {
      test();
    });
  });

  it('shouldn\'t submit incomplete form', function() {
    resultsPage.fillSubject('bad entry').then(function() {
      expect(browser.getCurrentUrl()).not.toContain('?form=');
      expect(element(by.model('form.predicate')).isPresent()).toBe(false);
      expect(element(by.model('form.object')).isPresent()).toBe(false);
      resultsPage.getResults().count().then(function(count) {
        expect(count).toEqual(0);
      });
    });
    resultsPage.fillSubject().then(function() {
      expect(element(by.model('form.object')).isPresent()).toBe(false);
      resultsPage.fillPredicate().then(function() {
        expect(browser.getCurrentUrl()).not.toContain('?form=');
        resultsPage.getResults().count().then(function(count) {
          expect(count).toEqual(0);
        });
        resultsPage.fillObject('bad entry').then(function() {
          expect(browser.getCurrentUrl()).not.toContain('?form=');
          resultsPage.getResults().count().then(function(count) {
            expect(count).toEqual(0);
          });
        });
      });
    });

    // On results page too
    resultsPage.execSearch().then(function() {
      var currentUrl = browser.getCurrentUrl();
      resultsPage.fillSubject('bad entry').then(function() {
        expect(browser.getCurrentUrl()).toEqual(currentUrl);
        expect(element(by.model('form.predicate')).isPresent()).toBe(false);
        expect(element(by.model('form.object')).isPresent()).toBe(false);
        resultsPage.getResults().count().then(function(count) {
          expect(count).not.toEqual(0);
        });
      });
      resultsPage.fillSubject().then(function() {
        expect(element(by.model('form.object')).isPresent()).toBe(false);
        resultsPage.fillPredicate().then(function() {
          expect(browser.getCurrentUrl()).toEqual(currentUrl);
          resultsPage.getResults().count().then(function(count) {
            expect(count).not.toEqual(0);
          });
          resultsPage.fillObject('bad entry').then(function() {
            expect(browser.getCurrentUrl()).toEqual(currentUrl);
            resultsPage.getResults().count().then(function(count) {
              expect(count).not.toEqual(0);
            });
          });
        });
      });
    });
  });

  it('should clear next inputs on edit', function() {
    var test = function() {
      resultsPage.fillAndEdit().then(function() {
        expect(element(by.model('form.object')).getAttribute('value')).not.toEqual('diabetes');
        expect(element(by.model('form.object')).getAttribute('value')).toEqual('');
      });
    };

    // Run the test
    test();
    // Same behaviour on results page
    resultsPage.execSearch().then(function() {
      test();
    });
  });

  it('should do a search', function() {
    var test = function() {
      resultsPage.execSearch().then(function() {
        resultsPage.getResults().count().then(function(count) {
          expect(count).not.toEqual(0);
        });
      });
    };
    // Run the test
    test();
    // Same behaviour on results page
    resultsPage.execSearch().then(function() {
      test();
    });
  });

  it('should have a filled form on results page', function() {
    resultsPage.execSearch().then(function() {
      resultsPage.getResults().count().then(function(count) {
        expect(element(by.model('form.subject')).getAttribute('value')).toEqual('Drug');
        expect(element(by.model('form.predicate')).getAttribute('value')).toEqual('has indication');
        expect(element(by.model('form.object')).getAttribute('value')).toEqual('Diabetes Mellitus');
      });
    });
  });

  it('should have working pagination', function() {
    resultsPage.execSearch().then(function() {
      resultsPage.getResults().then(function(elementAll) {
        var p1results = elementAll[0].getText();
        element(by.css('.pagination-next a')).click().then(function() {
          resultsPage.getResults().then(function(elementAll) {
            expect(elementAll[0].getText()).not.toEqual(p1results);
          });
        });
      });
    });
  });

  it('should have pro class', function() {
    resultsPage.execSearch().then(function() {
      resultsPage.getResults().each(function(element, index) {
        expect(hasClass(element, 'pro')).toBe(true);
      });
    });
  });

});
