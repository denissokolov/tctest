const KEY_LEVEL_LENGTH = 6;

function numberToKeyLevel(num) {
  return String(`00000${num}`).slice(-KEY_LEVEL_LENGTH);
}

export function generateKey(currentNumber, parentKey) {
  const currentPart = numberToKeyLevel(currentNumber);

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

export function swapFirstUncommonLevelsInKeys({ key1, key2 }) {
  const key1Levels = key1.split('/');
  const key2Levels = key2.split('/');

  const newKey1Levels = [];
  const newKey2Levels = [];

  const maxLength = key1Levels.length > key2Levels.length
    ? key1Levels.length
    : key2Levels.length;

  let firstDifferenceFound = false;

  for (let i = 0; i < maxLength; i += 1) {
    const key1Level = key1Levels[i];
    const key2Level = key2Levels[i];

    if (!firstDifferenceFound && key1Level && key2Level && key1Level !== key2Level) {
      newKey1Levels.push(key2Level);
      newKey2Levels.push(key1Level);
      firstDifferenceFound = true;
    } else {
      if (key1Level) {
        newKey1Levels.push(key1Level);
      }

      if (key2Level) {
        newKey2Levels.push(key2Level);
      }
    }
  }

  return {
    key1: newKey1Levels.join('/'),
    key2: newKey2Levels.join('/'),
  };
}

export function regenerateKeyFromParent(childKey, parentKey) {
  return parentKey + childKey.substring(parentKey.length);
}
