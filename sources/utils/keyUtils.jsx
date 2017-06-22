/* eslint-disable import/prefer-default-export */

const INDEX_PART_LENGTH = 6;

function numberToKeyPart(num, length) {
  return String(`00000${num}`).slice(-length);
}

export function generateKey(currentNumber, parentKey) {
  const currentPart = numberToKeyPart(currentNumber, INDEX_PART_LENGTH);

  if (parentKey) {
    return `${parentKey}/${currentPart}`;
  }

  return currentPart;
}

export function getParentKeyFromKey(key) {
  const lastDelimiterIndex = key.lastIndexOf('/');
  if (lastDelimiterIndex === -1) {
    return null;
  }

  return key.substring(0, lastDelimiterIndex);
}

export function getAllParentsKeysFromKey(key) {
  const parts = key.split('/');
  const parentKeys = [];
  let tempKey;

  for (let i = 0; i < parts.length - 1; i += 1) {
    tempKey = tempKey ? `${tempKey}/${parts[i]}` : parts[i];
    parentKeys.push(tempKey);
  }

  return parentKeys;
}
