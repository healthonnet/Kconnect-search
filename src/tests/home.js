'use strict';

describe('Protractor Home Page', function() {
  it('should have a title', function() {
    browser.get('http://localhost:3000');
    expect(browser.getTitle()).toEqual('Kconnect Search');
  });
  it('should have lang button', function() {
    browser.get('http://localhost:3000');
    var langLink = element(by.css('a[href*="language"]'));
    expect(langLink.isDisplayed()).toBe(true);
  });
});
