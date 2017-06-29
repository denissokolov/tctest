/* globals navigator */

const isIECached = navigator && navigator.appName === 'Microsoft Internet Explorer';
export function isIE() {
  return isIECached;
}
