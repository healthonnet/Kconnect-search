'use strict';

var ResultsPage = function() {
  this.get = function() {
    browser.get('http://localhost:3000/pro');
  };

  this.fillQuery = function(subject, predicate, object) {
    if (!subject) {
      subject = 'Drug';
    }
    if (!predicate) {
      predicate = 'has indications';
    }
    if (!object) {
      object = 'diabetes';
    }
    element(by.model('form.subject')).clear().sendKeys(subject);
    element(by.model('form.subject')).sendKeys(protractor.Key.ENTER);
    element(by.model('form.predicate')).clear().sendKeys(predicate);
    element(by.model('form.predicate')).sendKeys(protractor.Key.ENTER);
    element(by.model('form.object')).clear().sendKeys(object);
    return element(by.model('form.object')).sendKeys(protractor.Key.ENTER);
  };

  this.fillBadQuery = function() {
    element(by.model('form.subject')).clear().sendKeys('Drug');
    element(by.model('form.subject')).sendKeys(protractor.Key.ENTER);
    element(by.model('form.predicate')).clear().sendKeys('bad entry');
    return element(by.model('form.predicate')).sendKeys(protractor.Key.ENTER);
  };

  this.fillAndEdit = function() {
    element(by.model('form.subject')).clear().sendKeys('Drug');
    element(by.model('form.subject')).sendKeys(protractor.Key.ENTER);
    element(by.model('form.predicate')).clear().sendKeys('has indications');
    element(by.model('form.predicate')).sendKeys(protractor.Key.ENTER);
    element(by.model('form.object')).clear().sendKeys('diabetes');
    element(by.model('form.predicate')).clear().sendKeys('has indications');
    return element(by.model('form.predicate')).sendKeys(protractor.Key.ENTER);
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

var getColor = function(element, cls) {
  return element
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
    resultsPage.fillBadQuery().then(function() {
    expect(element(by.model('form.predicate')).getAttribute('value')).not.toEqual('bad entry');
    expect(element(by.model('form.predicate')).getAttribute('value')).toEqual('');
    });
  });

  // TODO check edit previous input clear others
  it('should clear next inputs on edit', function() {
    resultsPage.fillAndEdit().then(function() {
      expect(element(by.model('form.object')).getAttribute('value')).not.toEqual('diabetes');
      expect(element(by.model('form.object')).getAttribute('value')).toEqual('');
    });
  });

  it('should do a search', function() {
    resultsPage.execSearch().then(function() {
      // OK expect(browser.getCurrentUrl()).toContain('?q=cancer');
      resultsPage.getResults().count().then(function(count) {
        expect(count).not.toEqual(0);
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
