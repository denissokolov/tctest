const KEY_LEVEL_LENGTH = 6;

function numberToKeyLevel(num) {
  return String(`00000${num}`).slice(-KEY_LEVEL_LENGTH);
}

function getParentKeyAndCurrentLevelPosition(key) {
  const lastDelimiterIndex = key.lastIndexOf('/');
  if (lastDelimiterIndex === -1) {
    return {
      parentKey: '',
      currentLevelPosition: parseInt(key, 10),
    };
  }

  return {
    parentKey: key.substring(0, lastDelimiterIndex + 1),
    currentLevelPosition: parseInt(key.substring(lastDelimiterIndex + 1), 10),
  };
}

export function generateKey(currentNumber, parentKey) {
  const currentPart = numberToKeyLevel(currentNumber);

  if (parentKey) {
    return `${parentKey}/${currentPart}`;
  }

  return currentPart;
}

export function getNextKeyOnSameLevel(key) {
  const { parentKey, currentLevelPosition } = getParentKeyAndCurrentLevelPosition(key);

  const newPosition = currentLevelPosition + 1;
  return `${parentKey}${numberToKeyLevel(newPosition)}`;
}


export function getPrevKeyOnSameLevel(key) {
  const { parentKey, currentLevelPosition } = getParentKeyAndCurrentLevelPosition(key);

  const newPosition = currentLevelPosition - 1;
  return newPosition >= 0 ? `${parentKey}${numberToKeyLevel(newPosition)}` : null;
}

let oneThirdOfMaxLevelPosition = 0;
export function getOneThirdOfMaxLevelPosition() {
  if (oneThirdOfMaxLevelPosition) {
    return oneThirdOfMaxLevelPosition;
  }

  for (let i = 0; i < KEY_LEVEL_LENGTH; i += 1) {
    oneThirdOfMaxLevelPosition += 9 * (10 ** i);
  }

  oneThirdOfMaxLevelPosition /= 3;
  return oneThirdOfMaxLevelPosition;
}

let twoThirdOfMaxLevelPosition = 0;
export function getTwoThirdOfMaxLevelPosition() {
  if (twoThirdOfMaxLevelPosition) {
    return twoThirdOfMaxLevelPosition;
  }

  for (let i = 0; i < KEY_LEVEL_LENGTH; i += 1) {
    twoThirdOfMaxLevelPosition += 9 * (10 ** i);
  }

  twoThirdOfMaxLevelPosition = (twoThirdOfMaxLevelPosition * 2) / 3;
  return twoThirdOfMaxLevelPosition;
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
