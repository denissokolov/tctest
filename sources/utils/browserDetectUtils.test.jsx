/* global navigator */

import * as browserDetectUtils from './browserDetectUtils';

describe('browserDetectUtils', () => {
  it('should return false if global navigator.appName does not equal "Microsoft Internet Explorer"', () => {
    Object.defineProperty(navigator, 'appName', {
      writable: true,
      value: 'Chrome',
    });

    expect(browserDetectUtils.isIE()).toBeFalsy();
  });

  it('should return true if global navigator.appName equal "Microsoft Internet Explorer"', () => {
    Object.defineProperty(navigator, 'appName', {
      writable: true,
      value: 'Microsoft Internet Explorer',
    });

    expect(browserDetectUtils.isIE()).toBeTruthy();
  });
});
