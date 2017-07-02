/* global navigator */

export function isIE() {
  return navigator && navigator.appName === 'Microsoft Internet Explorer';
}
