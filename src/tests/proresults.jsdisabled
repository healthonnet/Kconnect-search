'use strict';

var ResultsPage = function() {
  this.get = function() {
    browser.get('http://localhost:3000/pro');
  };

  this.fillSubject = function(subject) {
    if (!subject) {
      subject = 'Drug';
    }
    element(by.model('form.subject')).click().sendKeys(subject);
    return element(by.model('form.subject')).sendKeys(protractor.Key.ENTER);
  };

  this.fillPredicate = function(predicate) {
    if (!predicate) {
      predicate = 'has indication';
    }
    element(by.model('form.predicate')).click().sendKeys(predicate);
    return element(by.model('form.predicate')).sendKeys(protractor.Key.ENTER);
  };

  this.fillObject = function(object) {
    if (!object) {
      object = 'diabetes';
    }
    element(by.model('form.object')).click().sendKeys(object);
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
    element(by.model('form.object')).click().sendKeys('diabetes');
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

  this.getTreatments = function() {
    return element.all(
      by.repeater(
        'treatment in fathead.content'
      )
    );
  };

  this.getFathead = function(type) {
    if (!type) {
      type = '.fathead';
    }
    return element(by.css(type));
  };

  this.getLowVisionButton = function(className) {
    if (!className) {
      className = '.tooltip-wt';
    }
    return element(by.css(className));
  };

  this.getLowVisionPanel = function() {
    return element(by.css('[ng-click="provisu()"]'));
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

  it('should have some treatments proposed', function() {
    resultsPage.execSearch().then(function() {
      resultsPage.getTreatments().count().then(function(count) {
        expect(count).not.toEqual(0);
      });
    });
  });

  it('should have a filled form on results page', function() {
    resultsPage.execSearch().then(function() {
      resultsPage.getResults().then(function() {
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

describe('Low vision results pages', function() {
  var resultsPage = new ResultsPage();

  beforeEach(function() {
    resultsPage.get();
  });

  it('should change color to white over black', function() {
    resultsPage.getLowVisionPanel().click().then(function() {
      return resultsPage.getLowVisionButton('.tooltip-bk').click();
    })
      .then(function() {
        return resultsPage.fillQuery();
      })
      .then(function() {
        expect(hasClass(element(by.css('body')), 'provisu-black')).toBe(true);
        resultsPage.getResults().each(function(element2, index) {
          expect(element2.element(by.css('.low-vision-link')).isPresent()).toBe(true);
        });
        resultsPage.getLowVisionPanel().click().then(function() {
          expect(hasClass(element(by.css('body')), 'provisu-black')).not.toBe(true);
        });
      });
  });
});